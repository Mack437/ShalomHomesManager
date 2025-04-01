import { Switch, Route, Redirect } from "wouter";
import FormDemoPage from "./pages/form-demo";
import NotFoundPage from "./pages/not-found";

function App() {
  return (
    <div>
      <Switch>
        <Route path="/" component={() => <Redirect to="/form-demo" />} />
        <Route path="/form-demo" component={FormDemoPage} />
        <Route component={NotFoundPage} />
      </Switch>
    </div>
  );
}

export default App;
