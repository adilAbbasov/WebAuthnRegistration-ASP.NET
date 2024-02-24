namespace AuthenticationWithWebAuthn.Entities
{
    public class Fingerprint
    {
        public int Id { get; set; }

        public User? User { get; set; }

        public int UserId { get; set; }

        public string? Key { get; set; }
    }
}
