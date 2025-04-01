import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertUserSchema, 
  insertPropertySchema, 
  insertApartmentSchema, 
  insertTaskSchema, 
  insertTransactionSchema, 
  insertActivitySchema
} from "@shared/schema";
import express from "express";
import session from "express-session";
import MemoryStore from "memorystore";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { z } from "zod";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";
import * as bcrypt from 'bcryptjs';
import { env } from "./config";

const MemoryStoreSession = MemoryStore(session);

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);

  // Session setup
  app.use(
    session({
      secret: process.env.SESSION_SECRET || "shalomhomes-session-secret",
      resave: false,
      saveUninitialized: false,
      cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 }, // 24 hours
      store: new MemoryStoreSession({
        checkPeriod: 86400000, // prune expired entries every 24h
      }),
    })
  );

  // Passport initialization
  app.use(passport.initialize());
  app.use(passport.session());

  // Use bcrypt for password comparison

  // Configure passport local strategy for email-based login
  passport.use(
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
      },
      async (email, password, done) => {
        try {
          const user = await storage.getUserByEmail(email);
          if (!user) {
            console.log(`Login attempt failed: No user found with email ${email}`);
            return done(null, false, { message: "Invalid email or password" });
          }

          // Compare password with bcrypt
          const isMatch = await bcrypt.compare(password, user.password || '');
          if (!isMatch) {
            console.log(`Login attempt failed: Invalid password for user ${email}`);
            return done(null, false, { message: "Invalid email or password" });
          }

          console.log(`User successfully authenticated: ${user.email}`);
          return done(null, user);
        } catch (error) {
          console.error(`Login error: ${error}`);
          return done(error);
        }
      }
    )
  );
  
  // Configure passport local strategy for username-based login
  passport.use('username', 
    new LocalStrategy(
      {
        usernameField: "username",
        passwordField: "password",
      },
      async (username, password, done) => {
        try {
          const user = await storage.getUserByUsername(username);
          if (!user) {
            console.log(`Login attempt failed: No user found with username ${username}`);
            return done(null, false, { message: "Invalid username or password" });
          }

          // Compare password with bcrypt
          const isMatch = await bcrypt.compare(password, user.password || '');
          if (!isMatch) {
            console.log(`Login attempt failed: Invalid password for user ${username}`);
            return done(null, false, { message: "Invalid username or password" });
          }

          console.log(`User successfully authenticated: ${user.username}`);
          return done(null, user);
        } catch (error) {
          console.error(`Login error: ${error}`);
          return done(error);
        }
      }
    )
  );

  // Configure Google OAuth Strategy
  passport.use(
    new GoogleStrategy(
      {
        clientID: env.GOOGLE_CLIENT_ID,
        clientSecret: env.GOOGLE_CLIENT_SECRET,
        callbackURL: env.GOOGLE_CALLBACK_URL,
        scope: ['profile', 'email']
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          // Check if user already exists with this Google ID
          let user = await storage.getUserByGoogleId(profile.id);
          
          if (user) {
            return done(null, user);
          }
          
          // If user doesn't exist but has an email, check if the email is already in use
          const email = profile.emails && profile.emails[0] ? profile.emails[0].value : '';
          if (email) {
            const existingUserByEmail = await storage.getUserByEmail(email);
            if (existingUserByEmail) {
              // Update the existing user with Google ID
              // Note: In a production app, you might want to implement a proper linking flow
              // This is a simplified version
              console.log(`User with email ${email} already exists. Linking with Google account.`);
              // This would require updating the existing user, which isn't in our current storage interface
              // For now, we'll just return the existing user
              return done(null, existingUserByEmail);
            }
          }
          
          // Create a new user with Google data
          if (email && profile.displayName) {
            // Generate a random username based on display name
            const baseUsername = profile.displayName.toLowerCase().replace(/\s+/g, '');
            let username = baseUsername;
            let counter = 1;
            
            // Check if username exists and generate a unique one
            while (await storage.getUserByUsername(username)) {
              username = `${baseUsername}${counter}`;
              counter++;
            }
            
            // Create new user
            const newUser = await storage.createUser({
              email,
              name: profile.displayName,
              username,
              googleId: profile.id,
              // No password for Google users
              password: null,
              role: 'client' // Default role
            });
            
            console.log(`Created new user from Google: ${newUser.email}`);
            return done(null, newUser);
          }
          
          // If we don't have email, we can't create a user
          return done(null, false, { message: 'Could not retrieve email from Google' });
        } catch (error) {
          console.error("Google auth error:", error);
          return done(error as Error);
        }
      }
    )
  );
  
  // Serialize user to session
  passport.serializeUser((user: any, done) => {
    done(null, user.id);
  });

  // Deserialize user from session
  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });

  // Middleware to handle Zod validation errors
  const validateRequest = (schema: z.ZodType<any>) => {
    return (req: Request, res: Response, next: NextFunction) => {
      try {
        req.body = schema.parse(req.body);
        next();
      } catch (error) {
        if (error instanceof ZodError) {
          const validationError = fromZodError(error);
          res.status(400).json({
            message: validationError.message,
          });
        } else {
          next(error);
        }
      }
    };
  };

  // Authentication middleware
  const requireAuth = (req: Request, res: Response, next: NextFunction) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    next();
  };

  // Role-based access middleware
  const requireRole = (roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const user = req.user as any;
      if (!roles.includes(user.role)) {
        return res.status(403).json({ message: "Forbidden" });
      }

      next();
    };
  };

  // Authentication Routes
  app.post(
    "/api/auth/login",
    passport.authenticate("local"),
    (req: Request, res: Response) => {
      res.json({ user: req.user });
    }
  );
  
  // Username-based login
  app.post(
    "/api/auth/login/username",
    passport.authenticate("username"),
    (req: Request, res: Response) => {
      res.json({ user: req.user });
    }
  );

  app.post("/api/auth/logout", (req: Request, res: Response) => {
    req.logout((err) => {
      if (err) return res.status(500).json({ message: "Error logging out" });
      res.json({ message: "Logged out successfully" });
    });
  });

  app.get("/api/auth/current-user", (req: Request, res: Response) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    res.json({ user: req.user });
  });
  
  // Google Auth Routes
  app.get(
    "/api/auth/google",
    passport.authenticate("google", { scope: ["profile", "email"] })
  );
  
  app.get(
    "/api/auth/google/callback",
    passport.authenticate("google", { 
      failureRedirect: "/login",
      session: true
    }),
    (req: Request, res: Response) => {
      // Successful authentication, redirect to dashboard or home
      res.redirect("/dashboard");
    }
  );

  // User Routes
  app.post(
    "/api/users",
    validateRequest(insertUserSchema),
    async (req: Request, res: Response) => {
      try {
        const existingUserEmail = await storage.getUserByEmail(req.body.email);
        if (existingUserEmail) {
          return res.status(400).json({ message: "Email already in use" });
        }

        const existingUserUsername = await storage.getUserByUsername(req.body.username);
        if (existingUserUsername) {
          return res.status(400).json({ message: "Username already in use" });
        }

        const user = await storage.createUser(req.body);
        res.status(201).json(user);
      } catch (error) {
        res.status(500).json({ message: "Error creating user" });
      }
    }
  );

  app.get(
    "/api/users",
    requireAuth,
    requireRole(["owner", "caretaker"]),
    async (req: Request, res: Response) => {
      try {
        const users = await storage.getUsers();
        res.json(users);
      } catch (error) {
        res.status(500).json({ message: "Error fetching users" });
      }
    }
  );

  // Property Routes
  app.post(
    "/api/properties",
    requireAuth,
    requireRole(["owner", "caretaker"]),
    validateRequest(insertPropertySchema),
    async (req: Request, res: Response) => {
      try {
        const property = await storage.createProperty(req.body);
        
        // Log activity
        const user = req.user as any;
        await storage.createActivity({
          userId: user.id,
          action: "created",
          entityType: "property",
          entityId: property.id,
          details: `Created property: ${property.name}`
        });
        
        res.status(201).json(property);
      } catch (error) {
        res.status(500).json({ message: "Error creating property" });
      }
    }
  );

  app.get(
    "/api/properties",
    async (req: Request, res: Response) => {
      try {
        const properties = await storage.getProperties();
        res.json(properties);
      } catch (error) {
        res.status(500).json({ message: "Error fetching properties" });
      }
    }
  );

  app.get(
    "/api/properties/:id",
    async (req: Request, res: Response) => {
      try {
        const property = await storage.getProperty(parseInt(req.params.id));
        if (!property) {
          return res.status(404).json({ message: "Property not found" });
        }
        res.json(property);
      } catch (error) {
        res.status(500).json({ message: "Error fetching property" });
      }
    }
  );

  // Apartment Routes
  app.post(
    "/api/apartments",
    requireAuth,
    requireRole(["owner", "caretaker"]),
    validateRequest(insertApartmentSchema),
    async (req: Request, res: Response) => {
      try {
        const apartment = await storage.createApartment(req.body);
        
        // Log activity
        const user = req.user as any;
        const property = await storage.getProperty(apartment.propertyId);
        await storage.createActivity({
          userId: user.id,
          action: "created",
          entityType: "apartment",
          entityId: apartment.id,
          details: `Created apartment ${apartment.number} in ${property?.name || 'a property'}`
        });
        
        res.status(201).json(apartment);
      } catch (error) {
        res.status(500).json({ message: "Error creating apartment" });
      }
    }
  );

  app.get(
    "/api/properties/:propertyId/apartments",
    async (req: Request, res: Response) => {
      try {
        const apartments = await storage.getApartmentsByProperty(
          parseInt(req.params.propertyId)
        );
        res.json(apartments);
      } catch (error) {
        res.status(500).json({ message: "Error fetching apartments" });
      }
    }
  );

  // Task Routes
  app.post(
    "/api/tasks",
    requireAuth,
    validateRequest(insertTaskSchema),
    async (req: Request, res: Response) => {
      try {
        const task = await storage.createTask(req.body);
        
        // Log activity
        const user = req.user as any;
        await storage.createActivity({
          userId: user.id,
          action: "created",
          entityType: "task",
          entityId: task.id,
          details: `Created task: ${task.title}`
        });
        
        res.status(201).json(task);
      } catch (error) {
        res.status(500).json({ message: "Error creating task" });
      }
    }
  );

  app.get(
    "/api/tasks",
    requireAuth,
    async (req: Request, res: Response) => {
      try {
        const tasks = await storage.getTasks();
        res.json(tasks);
      } catch (error) {
        res.status(500).json({ message: "Error fetching tasks" });
      }
    }
  );

  app.patch(
    "/api/tasks/:id/status",
    requireAuth,
    async (req: Request, res: Response) => {
      try {
        const { status } = req.body;
        if (!status) {
          return res.status(400).json({ message: "Status is required" });
        }

        const updatedTask = await storage.updateTaskStatus(
          parseInt(req.params.id),
          status
        );

        if (!updatedTask) {
          return res.status(404).json({ message: "Task not found" });
        }
        
        // Log activity
        const user = req.user as any;
        await storage.createActivity({
          userId: user.id,
          action: "updated",
          entityType: "task",
          entityId: updatedTask.id,
          details: `Updated task status to: ${status}`
        });
        
        res.json(updatedTask);
      } catch (error) {
        res.status(500).json({ message: "Error updating task" });
      }
    }
  );

  // Transaction Routes
  app.post(
    "/api/transactions",
    requireAuth,
    requireRole(["owner", "caretaker"]),
    validateRequest(insertTransactionSchema),
    async (req: Request, res: Response) => {
      try {
        const transaction = await storage.createTransaction(req.body);
        
        // Log activity
        const user = req.user as any;
        await storage.createActivity({
          userId: user.id,
          action: "created",
          entityType: "transaction",
          entityId: transaction.id,
          details: `Created transaction: ${transaction.type} for $${transaction.amount / 100}`
        });
        
        res.status(201).json(transaction);
      } catch (error) {
        res.status(500).json({ message: "Error creating transaction" });
      }
    }
  );

  app.get(
    "/api/transactions",
    requireAuth,
    requireRole(["owner", "caretaker"]),
    async (req: Request, res: Response) => {
      try {
        const transactions = await storage.getTransactions();
        res.json(transactions);
      } catch (error) {
        res.status(500).json({ message: "Error fetching transactions" });
      }
    }
  );

  // Activity Routes
  app.get(
    "/api/activities",
    requireAuth,
    async (req: Request, res: Response) => {
      try {
        const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
        const activities = await storage.getActivities(limit);
        res.json(activities);
      } catch (error) {
        res.status(500).json({ message: "Error fetching activities" });
      }
    }
  );

  return httpServer;
}
