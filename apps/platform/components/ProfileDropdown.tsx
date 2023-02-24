import styled from "styled-components";
import { createRef, HTMLAttributes, useState } from "react";
import { useClickOutside } from "../common/use-click-outside";
import { useRouter } from "next/router";
import { WidgetGenerationModal } from "./modals/WidgetGenerationModal";
import { useFcl } from "../common/user-context";

export function ProfileDropdown(props: HTMLAttributes<HTMLDivElement>) {
  const { isRegistered, isLoggedIn, logout } = useFcl();
  const [modalIsOpen, setIsModalOpen] = useState(false);
  const router = useRouter();
  const menuRef = createRef<HTMLDivElement>();
  const photoRef = createRef<HTMLImageElement>();
  const [isOpen, setIsOpen] = useState(false);
  useClickOutside(menuRef, (event) => {
    if (!photoRef.current?.contains(event.target)) {
      setIsOpen(false);
    }
  });

  async function navigate(path: string) {
    await router.push(path);
    setIsOpen(false);
  }

  return (
    <>
      {modalIsOpen && (
        <WidgetGenerationModal
          isOpen={true}
          shouldCloseOnOverlayClick
          onRequestClose={() => setIsModalOpen(false)}
        />
      )}
      <Container {...props}>
        <Photo
          ref={photoRef}
          onClick={() => setIsOpen(!isOpen)}
          className="profile-photo-small"
          src="/images/profile-photo-small.svg"
          alt=""
        />
        {isOpen && (
          <Dropdown ref={menuRef}>
            {isRegistered && (
              <DropdownItem onClick={() => navigate("/profile")}>
                My profile
              </DropdownItem>
            )}
            <DropdownItem onClick={() => navigate("/settings")}>
              {isRegistered ? "Profile settings" : "Create profile"}
            </DropdownItem>
            {isRegistered && (
              <DropdownItem onClick={() => setIsModalOpen(true)}>
                Get my widget
              </DropdownItem>
            )}
            {isLoggedIn && (
              <DropdownItem onClick={() => navigate("/").then(logout)}>
                Logout
              </DropdownItem>
            )}
          </Dropdown>
        )}
      </Container>
    </>
  );
}

const Container = styled.div`
  position: relative;
  display: flex;
`;

const Photo = styled.img`
  cursor: pointer;
  transition: 0.3s ease-in-out all;

  &:hover {
    transform: scale(1.1);
  }
`;

const Dropdown = styled.div`
  position: absolute;
  z-index: 100;
  width: 150px;
  right: 0;
  top: 110%;
  background: white;
  border-radius: ${({ theme }) => theme.gutter.md};
  color: ${({ theme }) => theme.colors.secondary};
  box-shadow: 0 3px 6px #00000029;
  display: flex;
  flex-direction: column;
`;

const DropdownItem = styled.button`
  text-align: center;
  padding: 10px 0;
  cursor: pointer;
  background: none;
  border: none;

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`;
