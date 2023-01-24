
import React,{ useEffect } from "react";
import { resetUserState } from '../features/auth/authSlice';
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";

export default function ErrorPage(){
    const currentUser = useSelector(state => state.auths);
    const dispatch = useDispatch();


    useEffect(() => {

            dispatch(resetUserState())


    }, [])
    return(
        <>
            <h1>Page Not Found</h1>
            <h2>Error 404</h2>
        </>
    );
}