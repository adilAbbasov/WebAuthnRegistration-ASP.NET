using AuthenticationWithWebAuthn.Entities;

namespace WebAuthnRegistration_ASP.NET.Dtos
{
    public class FingerprintDto
    {
        public int Id { get; set; }

        public int UserId { get; set; }

        public string? Key { get; set; }
    }
}
