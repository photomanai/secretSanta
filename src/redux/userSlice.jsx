import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getFirestore,
  collection,
  getDocs,
  query,
  where,
  doc,
  updateDoc,
} from "firebase/firestore";
import { app } from "../FireBase";

const db = getFirestore(app);

const initialState = {
  activeUser: "",
  users: [
    "Elvin",
    "Nərmin",
    "Kamran",
    "Gülşən",
    "Tural",
    "Aygün",
    "Şahin",
    "Narmin",
    "Vüsal",
    "Lalə",
    "Orxan",
    "İlkin",
    "Zeynəb",
    "Rəşad",
    "Aysel",
    "Elçin",
    "Ülviyyə",
    "Eldar",
    "Nihat",
    "Səbinə",
    "İsmayıl",
    "Rüfət",
    "Zaur",
    "Günay",
    "Zöhrə",
  ],
  fullUsers: [],
  selectedUsers: [],
  playedUsers: [],
  whoSend: [],
  loading: false, // loading state added
};

export const userIsPlayed = createAsyncThunk(
  "user/userIsPlayed",
  async (userName, { getState, rejectWithValue }) => {
    try {
      const { fullUsers } = getState().user;

      const playedUser = fullUsers.find((user) => user.data.name === userName);

      if (!playedUser) {
        throw new Error("User not found");
      }

      const userRef = doc(db, "users", playedUser.id);
      await updateDoc(userRef, {
        isPlayed: true,
      });
      return playedUser.id;
    } catch (e) {
      return rejectWithValue(e.message);
    }
  }
);

// Kullanıcıyı seçmek için
export const userIsSelected = createAsyncThunk(
  "user/userIsSelected",
  async (userName, { getState, rejectWithValue }) => {
    try {
      const { fullUsers } = getState().user; // Redux state'inden fullUsers'ı alıyoruz

      // fullUsers içinde userName ile eşleşen kullanıcıyı buluyoruz
      const selectedUser = fullUsers.find(
        (user) => user.data.name === userName
      );

      if (!selectedUser) {
        throw new Error("User not found");
      }

      // Firestore'da ilgili kullanıcıyı güncelliyoruz
      const userRef = doc(db, "users", selectedUser.id);
      await updateDoc(userRef, {
        isSelected: true,
      });

      return selectedUser.id; // Güncellenen kullanıcının id'sini döndürüyoruz
    } catch (e) {
      return rejectWithValue(e.message); // Hata durumunda mesajı döndürüyoruz
    }
  }
);

// Kullanıcıları almak için
export const readUsers = createAsyncThunk(
  "user/readUsers",
  async (_, { rejectWithValue }) => {
    try {
      // Tüm kullanıcıları almak
      const querySnapshot = await getDocs(collection(db, "users"));
      const users = [];
      querySnapshot.forEach((doc) => {
        users.push({
          id: doc.id,
          data: doc.data(),
        });
      });

      // isSelected: false olan kullanıcıları almak için sorgu oluşturuluyor
      const selectedQuery = query(
        collection(db, "users"),
        where("isSelected", "==", false)
      );
      const selectedSnapshot = await getDocs(selectedQuery);
      const selectedUsers = [];
      selectedSnapshot.forEach((doc) => {
        selectedUsers.push({
          id: doc.id,
          data: doc.data(),
        });
      });

      return { allUsers: users, selectedUsers: selectedUsers };
    } catch (e) {
      return rejectWithValue(e.message);
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    getActiveUser: (state, action) => {
      state.activeUser = action.payload;
    },
    getSelectedUsers: (state) => {},
  },
  extraReducers: (builder) => {
    builder
      .addCase(readUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(readUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.fullUsers = action.payload.allUsers;
        state.selectedUsers = action.payload.selectedUsers;
      })
      .addCase(readUsers.rejected, (state, action) => {
        state.loading = false;
        console.error("Error reading users:", action.payload);
      })
      .addCase(userIsSelected.pending, (state) => {
        state.loading = true;
      })
      .addCase(userIsSelected.fulfilled, (state, action) => {
        state.loading = false;
        // Burada, seçilen kullanıcının id'sini alıyoruz ve selectedUsers'dan bu kullanıcıyı çıkarıyoruz
        const updatedUserId = action.payload;
        state.selectedUsers = state.selectedUsers.filter(
          (user) => user.id !== updatedUserId
        );
      })
      .addCase(userIsSelected.rejected, (state, action) => {
        state.loading = false;
        console.error("Error updating user selection:", action.payload);
      })
      .addCase(userIsPlayed.pending, (state) => {
        state.loading = true;
      })
      .addCase(userIsPlayed.fulfilled, (state, action) => {
        const playedUserId = action.payload;
        // Played kullanıcısını selectedUsers'dan çıkarıyoruz ve playedUsers'a ekliyoruz
        const playedUser = state.selectedUsers.find(
          (user) => user.id === playedUserId
        );
        if (playedUser) {
          state.playedUsers.push(playedUser);
          state.selectedUsers = state.selectedUsers.filter(
            (user) => user.id !== playedUserId
          );
        }
        state.loading = false;
      })
      .addCase(userIsPlayed.rejected, (state, action) => {
        state.loading = false;
        console.error("Error updating user selection:", action.payload);
      });
  },
});

export const { getActiveUser, getSelectedUsers } = userSlice.actions;

export default userSlice.reducer;
