import { FlowService } from "../services/flow.service";
import useSWR from "swr";
import { DomainsService } from "@membership/domains";

export function useFlowBalance(address: string | undefined) {
  const flowService = FlowService.create();
  return useSWR(
    () => (address ? `flow-balance/${address}` : null),
    () => (address ? flowService.getFlowBalance(address) : undefined)
  );
}

export function useGetMembershipDefinitionsByAdmin(
  adminAddress: string | undefined
) {
  const flowService = FlowService.create();
  return useSWR(
    () => (adminAddress ? `membership-definitions/${adminAddress}` : null),
    () =>
      adminAddress
        ? flowService.getMembershipDefinitionsByAdmin(adminAddress)
        : undefined
  );
}

export function useGetMemberships(address: string | undefined) {
  const flowService = FlowService.create();
  return useSWR(
    () => (address ? `membership/${address}` : null),
    () => (address ? flowService.getMembershipsByAccount(address) : undefined)
  );
}

export function useGetDomainNameInfo(domainName: string | undefined) {
  const domainService = new DomainsService();
  return useSWR(
    () => (domainName ? `domain-name-info/${domainName}` : null),
    () => (domainName ? domainService.getNameInfo(domainName) : undefined)
  );
}
