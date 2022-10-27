import React from "react";
const user: any = ""

const UserContext = React.createContext({ user: user, setUser() { } })
export default UserContext