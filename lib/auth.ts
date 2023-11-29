import { auth } from "./firebase";
import { User, OAuthProvider, signInWithPopup, onAuthStateChanged, updateProfile } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function useUser() {
	const [user, setUser] = useState<User | null>()
	const router = useRouter()

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, (authUser) => {
			setUser(authUser)
		})

		return () => unsubscribe()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	useEffect(() => {
		onAuthStateChanged(auth, (authUser) => {
			if (user === undefined) return

			// refresh when user changed to ease testing
			if (user?.email !== authUser?.email) {
				router.refresh()
			}
		})
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [user])

	return user
}

export function signInWithKaKao() {
	const provider = new OAuthProvider("oidc.kakao")
	return signInWithPopup(auth, provider);
}

export async function signOut() {
	try {
		return auth.signOut();
	} catch (error) {
		console.error("Error signing out", error);
	}
}

export async function updateUserProfile(displayName: string, photoURL: string) {
	try {
		const res = await updateProfile(
			auth.currentUser!,
			{
				displayName: displayName,
				photoURL: photoURL
			}
		);
		// Handle success
		console.log("updateUserProfile", res);
	} catch (error) {
		console.error("Error updating user profile", error);
		// Handle error
	}
}

export async function getUserProfileById(userId: string) {
	//firebase admin sdk를 사용하면 가능
}