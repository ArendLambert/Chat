using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Chat.DataAccess.Entities
{
    public class FriendPairEntity
    {
        [Key]
        public Guid IdPair { get; set; }
        public Guid IdUser { get; set; }
        public Guid IdFriend { get; set; }
    }
}
