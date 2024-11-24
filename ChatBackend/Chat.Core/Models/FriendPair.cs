using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Xml.Linq;

namespace Chat.Core.Models
{
    public class FriendPair
    {
        public Guid Id { get; }
        public Guid UserId { get; }
        public Guid FriendId { get; }

        private FriendPair(Guid id, Guid userId, Guid friendId)
        {
            Id = id;
            UserId = userId;
            FriendId = friendId;
        }

        public static FriendPair Create(Guid id, Guid userId, Guid friendId)
        {
            return new FriendPair(id, userId, friendId);
        }
    }
}
