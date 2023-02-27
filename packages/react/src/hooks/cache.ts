import useSWR from "swr";
import { ServiceRegistry } from "../services/service-registry";

const { membershipService, domainService } = ServiceRegistry.create();

export function useFlowBalance(address: string | undefined) {
  return useSWR(
    () => (address ? `flow-balance/${address}` : null),
    () => (address ? membershipService.getFlowBalance(address) : undefined)
  );
}

export function useGetMembershipDefinitionsByAdmin(
  adminAddress: string | undefined
) {
  return useSWR(
    () => (adminAddress ? `membership-definitions/${adminAddress}` : null),
    () =>
      adminAddress
        ? membershipService.getMembershipDefinitionsByAdmin(adminAddress)
        : undefined
  );
}

export function useGetMembershipInstances(address: string | undefined) {
  return useSWR(
    () => (address ? `membership/${address}` : null),
    () =>
      address
        ? membershipService.getMembershipInstancesByAccount(address)
        : undefined
  );
}

export function useGetDomainNameInfo(domainName: string | undefined) {
  return useSWR(
    () => (domainName ? `domain-name-info/${domainName}` : null),
    () => (domainName ? domainService.getNameInfo(domainName) : undefined)
  );
}
