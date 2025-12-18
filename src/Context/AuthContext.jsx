import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from "firebase/auth";
import { auth } from "../Firebase/Firebase.config";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const googleProvider = new GoogleAuthProvider();

  const storeAuthToken = async (firebaseUser) => {
    if (firebaseUser) {
      const token = await firebaseUser.getIdToken();
      localStorage.setItem("authToken", token);
    } else {
      localStorage.removeItem("authToken");
    }
  };

  const createUserInBackend = async (firebaseUser, phone = null) => {
    const userData = {
      email: firebaseUser.email,
      displayName: firebaseUser.displayName || firebaseUser.email.split("@")[0],
      photoURL: firebaseUser.photoURL || null,
      phoneNumber: phone || firebaseUser.phoneNumber || null,
    };

    const token = localStorage.getItem("authToken");
    await axios.post("http://localhost:3000/users", userData, {
      headers: { Authorization: `Bearer ${token}` },
    });
  };

  const register = async (email, password, name, phone) => {
    setLoading(true);
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    await updateProfile(userCredential.user, {
      displayName: name,
    });

    // Store token
    await storeAuthToken(userCredential.user);

    await createUserInBackend(userCredential.user, phone);

    setLoading(false);
    return userCredential.user;
  };

  // Login user
  const login = async (email, password) => {
    setLoading(true);
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    await storeAuthToken(userCredential.user);
    setLoading(false);
    return userCredential.user;
  };

  // Logout user
  const logout = async () => {
    setLoading(true);
    await signOut(auth);
    localStorage.removeItem("authToken");
    setLoading(false);
  };

  // Google Sign In
  const googleSignIn = async () => {
    setLoading(true);
    const result = await signInWithPopup(auth, googleProvider);

    await storeAuthToken(result.user);
    await createUserInBackend(result.user);

    setLoading(false);
    return result.user;
  };

  useEffect(() => {
    let tokenRefreshInterval;

    if (user) {
      tokenRefreshInterval = setInterval(async () => {
        const token = await user.getIdToken(true);
        localStorage.setItem("authToken", token);
      }, 50 * 60 * 1000);
    }

    return () => {
      if (tokenRefreshInterval) {
        clearInterval(tokenRefreshInterval);
      }
    };
  }, [user]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        await storeAuthToken(currentUser);

        // Fetch user data from backend including role
        try {
          const token = localStorage.getItem("authToken");
          const response = await axios.get(
            `http://localhost:3000/users/${currentUser.email}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );

          // Merge Firebase user with backend user data (role, isPremium, isBlocked)
          const userData = {
            ...currentUser,
            role: response.data.role || "citizen",
            isPremium: response.data.isPremium || false,
            isBlocked: response.data.isBlocked || false,
            phoneNumber: response.data.phoneNumber || currentUser.phoneNumber,
          };

          setUser(userData);
        } catch (error) {
          console.error("Error fetching user data:", error);
          setUser(currentUser);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const value = {
    user,
    loading,
    register,
    login,
    logout,
    googleSignIn,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
