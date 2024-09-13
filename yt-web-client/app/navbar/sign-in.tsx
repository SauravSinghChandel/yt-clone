'use client';


import { Fragment } from "react"
import styles from "./sign-in.module.css";
import { signInWithGoogle, signOut } from "../utilities/firebase/firebase";
import { User } from 'firebase/auth';
import { toast } from 'react-toastify';

interface SignInProps {
    user: User | null;
}

export default function SignIn({ user }: SignInProps) {
    const handleSignInWithGoogle = async () => {
        try {
            await signInWithGoogle(); // Attempt sign-in
        } catch (error) {
            // Handle potential errors, including COOP
            if ((error as any).code === 'auth/popup-closed-by-user') {
                console.error('Error during sign-in:', error);
                toast.error('Popup closed before completion. Please try again.');
            } else {
                console.error('Error during sign-in:', error);
                toast.error('An error occurred during sign-in. Please try again later.');
            }
        }
    }
    return (
        <Fragment>

            {
                user ?
                    (
                        <button className={styles.signin} onClick={signOut}>
                            Sign Out
                        </button>
                    ) : (
                        <button className={styles.signin} onClick={handleSignInWithGoogle}>
                            Sign In
                        </button>
                    )
            }


        </Fragment>
    )
}
