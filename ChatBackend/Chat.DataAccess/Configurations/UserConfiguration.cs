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
    internal class UserConfiguration : IEntityTypeConfiguration<UserEntity>
    {
        public void Configure(EntityTypeBuilder<UserEntity> builder)
        {
            builder.HasKey(x => x.Id);

            builder.Property(b => b.Name)
                .HasMaxLength(User.MAX_NAME_LENGTH)
                .IsRequired();
             
            builder.Property(x => x.SessionId).IsRequired();

            builder.Property(x => x.Password)
                .HasMaxLength(User.MAX_NAME_LENGTH)
                .IsRequired();

            builder.Property(x => x.Email).IsRequired();
        }
    }
}
