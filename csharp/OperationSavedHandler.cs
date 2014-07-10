using System;
using System.Linq;
using System.Collections.Generic;
using iBoris.Unicorn;
using iBoris.Unicorn.Configuration;
using iBoris.iTos.Transports;

namespace iBoris.iTos.Operations
{
    public class OperationSavedHandler : IEntitySaved<Operation>
    {
        public void Saved(Operation entity, bool inserted, System.Collections.Generic.IDictionary<string, object> parameters = null)
        {
            if (entity.HasTransportTypes())
            {
                IContextProvider context = ApplicationConfiguration.ContextProvider;
                IList<int> transportTypeIds = (List<int>)context.GetTransactionData("TransportTypes");

                var ttFilter = new TransportTypeFilter { SuppressQuery = !transportTypeIds.Any() };
                ttFilter.Ids.AddRange(transportTypeIds.Cast<object>());
                var selectedTransportTypes = Persistence.GetLoader<TransportType, TransportTypeFilter>(ttFilter).List();

                IChildOperation childOperation = null;
                if (entity.Type.IsLoading())
                {
                    childOperation = new ChildOperation<LoadingOperation>(entity.Id);
                }
                else if (entity.Type.IsDischarging())
                {
                    childOperation = new ChildOperation<DischargingOperation>(entity.Id);
                }

                if (childOperation != null)
                {
                    childOperation.SyncTTypes(selectedTransportTypes);
                    childOperation.Save();
                }
            }
        }

        #region Private members
        private class ChildOperation<T> : IChildOperation
            where T : DomainObject<int>, new()
        {
            public ChildOperation(int Id)
            {
                try
                {
                    childOperation = Persistence.GetPersister<T>(Id).Load();
                }
                catch (DomainObjectNotFoundException)
                {
                }

                if (childOperation == null)
                {
                    childOperation = new T();
                    childOperation.Id = Id;
                }
            }

            public void SyncTTypes(IEnumerable<TransportType> newTransportTypes)
            {
                var newTransportTypeList = newTransportTypes.ToList();
                var removed = TransportTypes.Except(newTransportTypeList).ToList();
                foreach (var t in removed)
                {
                    TransportTypes.Remove(t);
                }
                var added = newTransportTypeList.Except(TransportTypes).ToList();
                foreach (var t in added)
                {
                    TransportTypes.Add(t);
                }
            }

            public void Save()
            {
                Persistence.GetPersisterForEntity<T>(childOperation).Save();
            }

            private IList<TransportType> TransportTypes
            {
                get
                {
                    IList<TransportType> ttypes = new List<TransportType>();
                    var a = childOperation as LoadingOperation;
                    if (a != null)
                    {
                        ttypes = a.TransportTypes;
                    }
                    if (ttypes == null)
                    {
                        var b = childOperation as DischargingOperation;
                        if (b != null)
                        {
                            ttypes = b.TransportTypes;
                        }
                    }
                    return ttypes;
                }
            }
            T childOperation;
        }
        interface IChildOperation
        {
            void SyncTTypes(IEnumerable<TransportType> newTransportTypes);
            void Save();
        }
        #endregion
    }
}