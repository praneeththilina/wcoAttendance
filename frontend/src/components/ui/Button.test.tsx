import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './Button';

describe('Button Component', () => {
  it('should render with children', () => {
    render(<Button>Click Me</Button>);
    expect(screen.getByText('Click Me')).toBeInTheDocument();
  });

  it('should apply primary variant styles by default', () => {
    const { container } = render(<Button>Primary</Button>);
    const button = container.firstChild as HTMLElement;
    expect(button).toHaveClass('bg-primary');
  });

  it('should apply different variant styles', () => {
    const { container: secondary } = render(<Button variant="secondary">Secondary</Button>);
    expect(secondary.firstChild).toHaveClass('bg-primary-light');

    const { container: outline } = render(<Button variant="outline">Outline</Button>);
    expect(outline.firstChild).toHaveClass('border-2');

    const { container: ghost } = render(<Button variant="ghost">Ghost</Button>);
    expect(ghost.firstChild).not.toHaveClass('bg-primary');
  });

  it('should apply different size styles', () => {
    const { container: sm } = render(<Button size="sm">Small</Button>);
    expect(sm.firstChild).toHaveClass('h-10');

    const { container: lg } = render(<Button size="lg">Large</Button>);
    expect(lg.firstChild).toHaveClass('h-14');

    const { container: xl } = render(<Button size="xl">XL</Button>);
    expect(xl.firstChild).toHaveClass('h-20');
  });

  it('should be disabled when isLoading is true', () => {
    render(<Button isLoading>Loading</Button>);
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });

  it('should show loading spinner when isLoading', () => {
    render(<Button isLoading>Loading</Button>);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
    const spinner = screen.getByText('progress_activity').parentElement;
    expect(spinner).toHaveClass('animate-spin');
  });

  it('should be disabled when disabled prop is true', () => {
    render(<Button disabled>Disabled</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('should call onClick when clicked', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click Me</Button>);
    
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('should not call onClick when disabled', () => {
    const handleClick = vi.fn();
    render(<Button disabled onClick={handleClick}>Disabled</Button>);
    
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('should render with leftIcon', () => {
    render(<Button leftIcon={<span data-testid="icon">📍</span>}>With Icon</Button>);
    expect(screen.getByTestId('icon')).toBeInTheDocument();
  });

  it('should render with rightIcon', () => {
    render(<Button rightIcon={<span data-testid="icon">➡️</span>}>With Icon</Button>);
    expect(screen.getByTestId('icon')).toBeInTheDocument();
  });
});
