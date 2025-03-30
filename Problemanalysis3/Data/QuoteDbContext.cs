using Microsoft.EntityFrameworkCore;
using Problemanalysis3.Models;
//For Database
namespace Problemanalysis3.Data
{
    public class QuoteDbContext : DbContext
    {
        public QuoteDbContext(DbContextOptions<QuoteDbContext> options) : base(options) { }

        public DbSet<Quote> Quotes { get; set; }
        public DbSet<Tag> Tags { get; set; }
        public DbSet<QuoteTag> QuoteTags { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<QuoteTag>()
                .HasKey(qt => new { qt.QuoteId, qt.TagId });

            modelBuilder.Entity<QuoteTag>()
                .HasOne(qt => qt.Quote)
                .WithMany(q => q.QuoteTags)
                .HasForeignKey(qt => qt.QuoteId);

            modelBuilder.Entity<QuoteTag>()
                .HasOne(qt => qt.Tag)
                .WithMany(t => t.QuoteTags)
                .HasForeignKey(qt => qt.TagId);
        }
    }
}
