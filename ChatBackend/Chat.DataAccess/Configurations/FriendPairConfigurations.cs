using Chat.Core.Models;
using Chat.DataAccess.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Chat.DataAccess.Configurations
{
    internal class FriendPairConfigurations : IEntityTypeConfiguration<FriendPairEntity>
    {
        public void Configure(EntityTypeBuilder<FriendPairEntity> builder)
        {
            builder.HasKey(x => x.IdPair);

            builder.Property(b => b.IdUser)
                .IsRequired();

            builder.Property(x => x.IdFriend)
                .IsRequired();
        }
    }
}
