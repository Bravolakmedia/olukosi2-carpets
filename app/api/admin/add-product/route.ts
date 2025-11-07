import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabaseAdmin"

export async function POST(req: Request) {
  const productData = await req.json()
  const { error } = await supabaseAdmin.from("products").insert([productData])

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  return NextResponse.json({ message: "Product created successfully!" }, { status: 200 })
}
