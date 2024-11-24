using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace Chat.Core.Models
{
    public class User
    {
        public const int MAX_NAME_LENGTH = 32;
        public Guid Id { get; }
        public string Name { get; } = string.Empty;
        public string Password { get; } = string.Empty;
        public string SessionId { get; } = string.Empty;
        public string Email { get; } = string.Empty;
        //public List<User> Friends { get; } = new List<User>();

        private User(Guid id, string name, string sessionId, string password, string email)
        {
            Id = id;
            Name = name;
            SessionId = sessionId;
            Password = password;
            Email = email;
        }

        public static (User User, string Error) Create(Guid id, string name, string sessionId, string password, string email)
        {
            var error = string.Empty;
            if (string.IsNullOrEmpty(name) || name.Length > MAX_NAME_LENGTH)
            {
                error = $"Name is empty or more then {MAX_NAME_LENGTH} symbols";
            }
            if (string.IsNullOrEmpty(password) || password.Length > MAX_NAME_LENGTH)
            {
                error = $"Password is empty or more then {MAX_NAME_LENGTH} symbols";
            }
            return (new User(id, name, sessionId, password, email), error);
        }
    }
}
