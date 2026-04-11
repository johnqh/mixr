import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { NotFoundPage } from './NotFoundPage';

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

function renderWithProviders() {
  return render(
    <HelmetProvider>
      <MemoryRouter>
        <NotFoundPage />
      </MemoryRouter>
    </HelmetProvider>
  );
}

describe('NotFoundPage', () => {
  it('renders the 404 heading', () => {
    renderWithProviders();
    expect(screen.getByText('heading')).toBeInTheDocument();
  });

  it('renders the "Page Not Found" message', () => {
    renderWithProviders();
    expect(screen.getByText('subheading')).toBeInTheDocument();
  });

  it('renders a Go Back button', () => {
    renderWithProviders();
    expect(screen.getByText('goBack')).toBeInTheDocument();
  });

  it('renders a Browse Recipes link', () => {
    renderWithProviders();
    const links = screen.getAllByText('browseRecipes');
    expect(links.length).toBeGreaterThanOrEqual(1);
  });

  it('navigates back when Go Back is clicked', async () => {
    renderWithProviders();
    const goBackButton = screen.getByText('goBack');
    goBackButton.click();
    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });

  it('renders quick links section', () => {
    renderWithProviders();
    expect(screen.getByText('links.home')).toBeInTheDocument();
    expect(screen.getByText('links.signIn')).toBeInTheDocument();
  });
});
