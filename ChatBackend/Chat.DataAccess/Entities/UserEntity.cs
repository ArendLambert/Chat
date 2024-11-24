using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Chat.DataAccess.Entities
{
    [Index(nameof(Email), IsUnique = true)]
    public class UserEntity
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string SessionId { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        //public List<User> Friends { get; set; } = new List<User>();
    }
}
