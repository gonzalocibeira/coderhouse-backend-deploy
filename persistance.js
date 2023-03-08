import { db } from "./config/firestoreConfig.js";
import { collection, addDoc, query, getDocs } from "firebase/firestore";


// Class constructor
class Container {

    constructor(objType){
        this.objType = String(objType).toLocaleLowerCase()
    }

    async save (object){
        try {
            const coll = collection(db, this.objType);
            await addDoc(coll, object != null ? object : {})
        }
        catch (err) {console.log(err)}
    };

    async getAll (){
        const objs = [];

        try {
            const q = query(collection(db, this.objType));
            const snapshot = await getDocs(q);
            snapshot.forEach((doc) => {objs.push(doc.data())});

            return objs

        }
        catch (err) {console.log(err)}
    };
};

export default Container;