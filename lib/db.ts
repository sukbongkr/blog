import { doc, getDoc, setDoc, collection, query, where, getDocs, deleteDoc } from "firebase/firestore";
import { db } from "./firebase";
import { ref, deleteObject, listAll } from "firebase/storage";
import { storage } from "./firebase";

export async function createAndUpdatePost(postContent: any, postId: string) {
	const postsRef = doc(db, 'Posts', postId);

	return setDoc(postsRef, {
		title: postContent.title,
		content: postContent.content,
		description: postContent.description,
		createdAt: postContent.createdAt,
		tag: postContent.tag,
		author: postContent.author,
		authorName: postContent.authorName,
		authorAvatar: postContent.authorAvatar,
	});
}

//포스트 전부 가져오기
export async function getAllPosts() {
	const postCollectionRef = collection(db, 'Posts');
	const postSnapshot = await getDocs(postCollectionRef);

	const posts = postSnapshot.docs.map(doc => ({
		...doc.data() as any,
		id: doc.id
	}));

	return posts;
}

//포스트 하나만 가져오기
export async function getPost(postId: string) {
	const postRef = doc(db, 'Posts', postId);

	const docSnap = await getDoc(postRef);

	if (docSnap.exists()) {
		return docSnap.data();
	} else {
		console.log("No such document!");
	}
}

export async function deletePost(postId: string) {
	const postRef = doc(db, 'Posts', postId);

	await deleteDoc(postRef);

	const listRef = ref(storage, 'images/' + postId)
	listAll(listRef)
		.then((res) => {
			res.prefixes.forEach((folderRef) => {
				// All the prefixes under listRef.
				// You may call listAll() recursively on them.
			});
			res.items.forEach((itemRef) => {
				// All the items under listRef.
				deleteObject(itemRef).then(() => {
					// File deleted successfully
				}).catch((error) => {
					// Uh-oh, an error occurred!
				});
			});
		}).catch((error) => {
			// Uh-oh, an error occurred!
		});
}
