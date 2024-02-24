namespace AuthenticationWithWebAuthn.Entities
{
    public class User
    {
        public int Id { get; set; }

        public string? UserName { get; set; }

        public string? Email { get; set; }

        public virtual IEnumerable<Fingerprint>? Fingerprints { get; set; }
    }
}
