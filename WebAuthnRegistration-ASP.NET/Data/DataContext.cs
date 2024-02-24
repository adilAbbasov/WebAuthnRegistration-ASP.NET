using AuthenticationWithWebAuthn.Entities;
using Microsoft.EntityFrameworkCore;

namespace AuthenticationWithWebAuthn.Data
{
    public class DataContext(DbContextOptions<DataContext> options) : DbContext(options)
    {
        public virtual DbSet<User> Users { get; set; }

        public virtual DbSet<Fingerprint> Fingerprints { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder) => optionsBuilder.UseNpgsql("Host=localhost;Port=5432;Database=WebAuthn;Username=postgres;Password=adil2002");
    }
}
