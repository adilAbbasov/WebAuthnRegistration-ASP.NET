using AuthenticationWithWebAuthn.Entities;

namespace WebAuthnRegistration_ASP.NET.Dtos
{
    public class UserDto
    {
        public int Id { get; set; }

        public string? UserName { get; set; }

        public string? Email { get; set; }
    }
}
