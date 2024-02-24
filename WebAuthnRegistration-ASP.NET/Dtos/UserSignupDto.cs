namespace AuthenticationWithWebAuthn.Dtos
{
    public class UserSignupDto
    {
        public string? Email { get; set; }

        public string? UserName { get; set; }

        public string? FingerprintKey { get; set; }
    }
}
