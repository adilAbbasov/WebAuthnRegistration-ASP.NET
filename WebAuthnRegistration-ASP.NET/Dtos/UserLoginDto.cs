namespace AuthenticationWithWebAuthn.Dtos
{
    public class UserLoginDto
    {
        public string? UserName { get; set; }

        public string? FingerprintKey { get; set; }
    }
}
