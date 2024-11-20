import { useContext } from 'react'
import {
    BrowserRouter as Router,
    Route,
    Routes,
    Navigate
} from "react-router-dom"

import Login from '../pages/Login/Login';
import CollectionBoxForm from '../pages/CollectionBoxForm/CollectionBoxForm';
import CheckBox from '../pages/CheckBox/CheckBox';
import Maps from '../pages/Maps/Maps';

import { AuthProvider, AuthContext } from "../context/auth";

const AppRoutes = () => {
    const Private = ({ children }) => {
        const { authenticated, loading } = useContext(AuthContext)

        if(loading){
            return <div className="loading">Carregando...</div>
        }

        if (!authenticated) {
            return <Navigate to="/" />
        }
        return children
    }

    return (
        <Router>
            <AuthProvider>
                <Routes>
                    <Route exact path="/" element={<Login />}></Route>
                    <Route exact path="/collection-box-form" element={
                        <Private >
                            <CollectionBoxForm />
                        </Private>
                    } ></Route>
                    <Route exact path="/check-box" element={
                        <Private >
                            <CheckBox />
                        </Private>
                    } ></Route>
                    <Route exact path="/maps" element={
                        <Private >
                            <Maps />
                        </Private>
                    } ></Route>
                </Routes>
            </AuthProvider>
        </Router>
    )
}

export default AppRoutes;