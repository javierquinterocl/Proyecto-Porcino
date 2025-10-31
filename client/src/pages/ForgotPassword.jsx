import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Link } from "react-router-dom"
import { userService } from "@/services/api"
import AuthLayout from "@/components/AuthLayout"
import AuthHeader from "@/components/AuthHeader"
import AuthCard from "@/components/AuthCard"

// Constante para la URL de la API


export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setIsLoading(true)

    try {
      // Validaciones básicas
      if (!email) {
        throw new Error("El correo electrónico es obligatorio")
      }

      // Validar formato de email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(email)) {
        throw new Error("El formato del correo electrónico no es válido")
      }

      console.log("Generando token de recuperación de contraseña...")

      const { token, expiresAt } = await userService.requestPasswordReset(email)

      const resetUrl = `${window.location.origin}/reset-password/${token}`

      try {
        if (navigator?.clipboard?.writeText) {
          await navigator.clipboard.writeText(resetUrl)
        }
      } catch (clipboardError) {
        console.warn("No se pudo copiar el enlace al portapapeles", clipboardError)
      }

      const expiration = new Date(expiresAt)
      const expirationText = new Intl.DateTimeFormat('es-CO', {
        hour: '2-digit',
        minute: '2-digit'
      }).format(expiration)

      setSuccess(`Se generó un enlace temporal. Puedes restablecer tu contraseña desde ${resetUrl}. (Expira a las ${expirationText}). El enlace también se copió en tu portapapeles si fue posible.`)
      setEmail("")

    } catch (error) {
      console.error("Error en la recuperación de contraseña:", error)
      
      if (error instanceof Error) {
        setError(error.message)
      } else {
        setError("Ha ocurrido un error inesperado")
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthLayout>
       <AuthCard>
          <AuthHeader 
            title="Recuperar contraseña"
            subtitle="Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña."
          />
     
        {error && (
          <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-500">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 rounded-md bg-green-50 p-3 text-sm text-green-500">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <Label htmlFor="email" className="text-sm font-semibold text-[#1a2e02] mb-2 block">
              Correo electrónico
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Ingrese su correo electrónico"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6b7c45] focus:border-transparent transition-all duration-200"
              required
            />
          </div>

          <Button 
            type="submit" 
            disabled={isLoading || success} 
            className="w-full bg-[#1a2e02] text-white hover:bg-[#2a4a04]"
          >
            {isLoading ? "ENVIANDO..." : success ? "ENVIADO" : "ENVIAR ENLACE"}
          </Button>

          <div className="mt-4 text-center text-sm">
            <Link to="/login" className="font-medium text-[#6b7c45] hover:underline">
              ← Volver al inicio de sesión
            </Link>
          </div>
        </form>
      </AuthCard>
    </AuthLayout>
  )
}
