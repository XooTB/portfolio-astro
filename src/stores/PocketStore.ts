import Pocketbase from "pocketbase";
import { create } from "zustand";

export type PocketTypes = {
  pb: Pocketbase;
};

const PocketStore = create<PocketTypes>((set) => ({
  pb: new Pocketbase(import.meta.env.PUBLIC_POCKETBASE_URL),
}));

export default PocketStore;
