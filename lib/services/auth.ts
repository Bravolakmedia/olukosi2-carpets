import { supabase } from "../supabaseClient"
import bcrypt from "bcryptjs"

export class AuthService {
  // Admin login
  static async loginAdmin(email: string, password: string) {
    // Get admin by email
    const { data: admin, error } = await supabase
      .from("admins")
      .select("*")
      .eq("email", email)
      .eq("is_active", true)
      .single()

    if (error || !admin) {
      throw new Error("Invalid credentials")
    }

    // Check if account is locked
    if (admin.locked_until && new Date(admin.locked_until) > new Date()) {
      throw new Error("Account is temporarily locked")
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, admin.password_hash)

    if (!isValidPassword) {
      // Increment failed attempts
      const failedAttempts = admin.failed_login_attempts + 1
      const updates: any = { failed_login_attempts: failedAttempts }

      // Lock account after 5 failed attempts
      if (failedAttempts >= 5) {
        updates.locked_until = new Date(Date.now() + 15 * 60 * 1000).toISOString() // 15 minutes
      }

      await supabase.from("admins").update(updates).eq("id", admin.id)

      throw new Error("Invalid credentials")
    }

    // Reset failed attempts and update last login
    await supabase
      .from("admins")
      .update({
        failed_login_attempts: 0,
        locked_until: null,
        last_login: new Date().toISOString(),
      })
      .eq("id", admin.id)

    // Log login activity
    await supabase.from("admin_activity_logs").insert({
      admin_id: admin.id,
      action: "login",
      details: { login_time: new Date().toISOString() },
    })

    return {
      id: admin.id,
      email: admin.email,
      name: admin.name,
      role: admin.role,
    }
  }

  // Create admin (for registration)
  static async createAdmin(adminData: {
    email: string
    password: string
    name: string
    role?: string
  }) {
    // Hash password
    const passwordHash = await bcrypt.hash(adminData.password, 10)

    const { data, error } = await supabase
      .from("admins")
      .insert({
        email: adminData.email,
        password_hash: passwordHash,
        name: adminData.name,
        role: (adminData.role as any) || "staff",
      })
      .select()
      .single()

    if (error) throw error
    return data
  }
}
