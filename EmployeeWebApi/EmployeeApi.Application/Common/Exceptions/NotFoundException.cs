using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EmployeeApi.Application.Common.Exceptions
{
    /// <summary>
    /// Thrown when an entity is not found.
    /// </summary>
    public class NotFoundException : AppException
    {
        public NotFoundException(string entityName, object key)
            : base($"Entity \"{entityName}\" (Key: {key}) was not found.")
        { }
    }
}

