import { useFlow } from "@membership/client";

export function useUserInfo(handleOrAddress: string | undefined): any {
  const {currentUser} = useFlow()

  // TODO: Adapt
  return {
    isLoading: false,
    address: currentUser?.address,
    handle: '',
    isSelf: false,
    info: null,
    donations: [], // TODO: Remove
    infoError: null,
    handleError: null,
    refetchInfo: null,
    addressError: null,
    donationsError: null,
    isValidatingDonations: false,
  };
}
