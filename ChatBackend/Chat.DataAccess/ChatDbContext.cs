using Chat.DataAccess.Entities;
using Microsoft.EntityFrameworkCore;

namespace Chat.DataAccess
{
    public class ChatDbContext : DbContext
    {
        public ChatDbContext(DbContextOptions<ChatDbContext> options) : base(options)
        {         
        }

        public DbSet<UserEntity> Users { get; set; }
        public DbSet<FriendPairEntity> Friends { get; set; }
    }
}
