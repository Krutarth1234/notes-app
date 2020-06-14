import React from "react";
import { Route, Switch} from "react-router-dom";
import Home from "./containers/Home";
import NotFound from "./containers/NotFound";
import Login from "./containers/Login";
import AppliedRoute from "./components/AppliedRoute";

export default ({ childProps }) =>
    <Switch>
        <Route path = "/" exact component = {Home} props = {childProps} />
        <Route path = "/login" exact component = {Login} props = {childProps} />
        <Route component = {NotFound} />
    </Switch>;