import { supabase } from "@/lib/supabase";

export type AssetType = "money" | "gold";

export type SavedAsset = {
  id: string;
  user_id: string;
  asset_type: AssetType;
  name: string;
  currency: string;
  amount: number | null;
  weight_grams: number | null;
  purity: number | null;
  price_per_gram: number | null;
  created_at: string;
  updated_at: string;
};

type MoneyAssetInput = {
  asset_type: "money";
  name: string;
  currency: string;
  amount: number;
};

type GoldAssetInput = {
  asset_type: "gold";
  name: string;
  currency: string;
  weight_grams: number;
  purity: 18 | 21 | 22 | 24;
  price_per_gram: number;
};

export type NewAssetInput = MoneyAssetInput | GoldAssetInput;

export async function getCurrentUserId() {
  const { data, error } = await supabase.auth.getUser();

  if (error) throw error;
  if (!data.user) throw new Error("Please sign in to manage saved assets.");

  return data.user.id;
}

export async function getSavedAssets(): Promise<SavedAsset[]> {
  const userId = await getCurrentUserId();

  const { data, error } = await supabase
    .from("saved_assets")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;

  return (data ?? []) as SavedAsset[];
}


export async function createSavedAsset(input: NewAssetInput) {
  const userId = await getCurrentUserId();

  if (input.asset_type === "money") {
    const { data, error } = await supabase
      .from("saved_assets")
      .insert({
        user_id: userId,
        asset_type: "money",
        name: input.name.trim(),
        currency: input.currency,
        amount: input.amount,
        weight_grams: null,
        purity: null,
        price_per_gram: null,
      })
      .select()
      .single();

    if (error) throw error;

    return data as SavedAsset;
  }

  const { data, error } = await supabase
    .from("saved_assets")
    .insert({
      user_id: userId,
      asset_type: "gold",
      name: input.name.trim(),
      currency: input.currency,
      amount: null,
      weight_grams: input.weight_grams,
      purity: input.purity,
      price_per_gram: input.price_per_gram,
    })
    .select()
    .single();

  if (error) throw error;

  return data as SavedAsset;
}



export async function updateSavedAsset(
  id: string,
  input: NewAssetInput,
) {
  const userId = await getCurrentUserId();

  if (input.asset_type === "money") {
    const { data, error } = await supabase
      .from("saved_assets")
      .update({
        asset_type: "money",
        name: input.name.trim(),
        currency: input.currency,
        amount: input.amount,
        weight_grams: null,
        purity: null,
        price_per_gram: null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .eq("user_id", userId)
      .select()
      .single();

    if (error) throw error;

    return data as SavedAsset;
  }

  const { data, error } = await supabase
    .from("saved_assets")
    .update({
      asset_type: "gold",
      name: input.name.trim(),
      currency: input.currency,
      amount: null,
      weight_grams: input.weight_grams,
      purity: input.purity,
      price_per_gram: input.price_per_gram,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .eq("user_id", userId)
    .select()
    .single();

  if (error) throw error;

  return data as SavedAsset;
}

export async function deleteSavedAsset(id: string) {
  const userId = await getCurrentUserId();

  const { error } = await supabase
    .from("saved_assets")
    .delete()
    .eq("id", id)
    .eq("user_id", userId);

  if (error) throw error;
}
