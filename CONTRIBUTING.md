# Contributing to BooksyGo

First off, thank you for considering contributing to BooksyGo! 🎉

## Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the existing issues to avoid duplicates. When creating a bug report, include as many details as possible:

- **Use a clear and descriptive title**
- **Describe the exact steps to reproduce the problem**
- **Provide specific examples**
- **Describe the behavior you observed and what you expected**
- **Include screenshots if relevant**
- **Include your environment details** (OS, browser, Node version, etc.)

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, include:

- **Use a clear and descriptive title**
- **Provide a detailed description of the suggested enhancement**
- **Explain why this enhancement would be useful**
- **List any alternative solutions you've considered**

### Pull Requests

1. **Fork the repository** and create your branch from `main`
2. **Follow the code style** of the project
3. **Write clear commit messages**
4. **Include tests** for new features
5. **Update documentation** as needed
6. **Ensure all tests pass** before submitting

## Development Setup

### Prerequisites
- Node.js 20+
- Python 3.11+
- Docker & Docker Compose
- PostgreSQL 16+
- Redis 7+

### Setup Steps

```bash
# 1. Clone your fork
git clone https://github.com/YOUR_USERNAME/BooksyGo.git
cd BooksyGo

# 2. Add upstream remote
git remote add upstream https://github.com/original/BooksyGo.git

# 3. Setup environment
make setup

# 4. Install dependencies
make install

# 5. Start services
make start

# 6. Run migrations
make migrate
```

## Code Style

### TypeScript/JavaScript
- Use **ESLint** and **Prettier**
- Follow **Airbnb Style Guide**
- Use **TypeScript strict mode**
- Prefer `const` over `let`
- Use arrow functions for callbacks
- Use async/await over promises

```typescript
// Good ✓
const fetchUser = async (id: string): Promise<User> => {
  const user = await userRepository.findById(id);
  if (!user) {
    throw new NotFoundException('User not found');
  }
  return user;
};

// Bad ✗
function fetchUser(id) {
  return userRepository.findById(id).then(user => {
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  });
}
```

### Python
- Follow **PEP 8**
- Use **Black** for formatting
- Use **type hints**
- Use **async/await** for I/O operations

```python
# Good ✓
async def fetch_flights(
    origin: str,
    destination: str,
    date: datetime
) -> List[Flight]:
    """Fetch flights from external API."""
    async with httpx.AsyncClient() as client:
        response = await client.get(
            f"{API_URL}/flights",
            params={"from": origin, "to": destination, "date": date}
        )
        return [Flight(**data) for data in response.json()]

# Bad ✗
def fetch_flights(origin, destination, date):
    response = requests.get(f"{API_URL}/flights?from={origin}&to={destination}&date={date}")
    return response.json()
```

## Git Commit Messages

- Use the present tense ("Add feature" not "Added feature")
- Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
- Limit the first line to 72 characters
- Reference issues and pull requests liberally

### Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation only changes
- `style`: Code style changes (formatting, semicolons, etc.)
- `refactor`: Code change that neither fixes a bug nor adds a feature
- `perf`: Performance improvement
- `test`: Adding missing tests
- `chore`: Changes to build process or auxiliary tools

**Examples:**
```
feat(search): add flexible date search feature

Add ability to search flights ±3 days around selected date.
This helps users find better deals.

Closes #123
```

```
fix(booking): prevent duplicate booking submissions

Add idempotency check to prevent double-charging users
when they click submit multiple times.

Fixes #456
```

## Testing

### Running Tests

```bash
# Run all tests
make test

# Run specific service tests
cd services/user-service && npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage
```

### Writing Tests

```typescript
describe('UserService', () => {
  let userService: UserService;
  let userRepository: jest.Mocked<UserRepository>;

  beforeEach(() => {
    userRepository = createMockUserRepository();
    userService = new UserService(userRepository);
  });

  describe('register', () => {
    it('should create a new user', async () => {
      // Arrange
      const userData = {
        email: 'test@example.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe',
      };

      // Act
      const user = await userService.register(userData);

      // Assert
      expect(user).toBeDefined();
      expect(user.email).toBe(userData.email);
      expect(userRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          email: userData.email,
        })
      );
    });

    it('should throw error if email already exists', async () => {
      // Arrange
      userRepository.findByEmail.mockResolvedValue(existingUser);

      // Act & Assert
      await expect(
        userService.register({ email: 'existing@example.com' })
      ).rejects.toThrow('Email already exists');
    });
  });
});
```

## Documentation

- Update README.md if you change functionality
- Update API documentation in `docs/api.md`
- Add JSDoc/docstrings to all public functions
- Update ARCHITECTURE.md for architectural changes

```typescript
/**
 * Create a new booking for the user.
 *
 * @param userId - The ID of the user making the booking
 * @param bookingData - The booking details
 * @returns The created booking with confirmation code
 * @throws {NotFoundException} If user is not found
 * @throws {PaymentException} If payment processing fails
 *
 * @example
 * ```typescript
 * const booking = await createBooking(
 *   'user-123',
 *   {
 *     flightId: 'flight-456',
 *     hotelId: 'hotel-789',
 *   }
 * );
 * ```
 */
async function createBooking(
  userId: string,
  bookingData: BookingInput
): Promise<Booking> {
  // Implementation
}
```

## Pull Request Process

1. **Update dependencies** if you've added any
2. **Update documentation** to reflect changes
3. **Add tests** for new functionality
4. **Ensure all tests pass**: `make test`
5. **Run linter**: `make lint`
6. **Update CHANGELOG.md** with your changes
7. **Request review** from at least one maintainer

### PR Title Format
```
<type>: <description>

Example:
feat: add AI-powered itinerary generator
fix: resolve booking confirmation email bug
```

### PR Description Template
```markdown
## Description
Brief description of what this PR does.

## Motivation
Why is this change needed?

## Changes
- List of changes made
- Another change
- And another

## Screenshots (if applicable)
Add screenshots for UI changes

## Testing
How has this been tested?

## Checklist
- [ ] My code follows the code style of this project
- [ ] I have updated the documentation accordingly
- [ ] I have added tests to cover my changes
- [ ] All new and existing tests passed
- [ ] My changes generate no new warnings
- [ ] I have checked my code and corrected any misspellings
```

## Code Review Process

All submissions require review. We use GitHub pull requests for this purpose.

### For Reviewers

- Be respectful and constructive
- Focus on the code, not the person
- Explain the reasoning behind suggestions
- Approve PRs that meet quality standards

### Review Checklist
- [ ] Code follows project style guidelines
- [ ] Changes are well-tested
- [ ] Documentation is updated
- [ ] No unnecessary dependencies added
- [ ] Performance implications considered
- [ ] Security implications considered
- [ ] Backward compatibility maintained

## Project Structure

```
BooksyGo/
├── frontend/              # Next.js frontend
├── services/              # Microservices
│   ├── api-gateway/      # API Gateway
│   ├── user-service/     # User management
│   ├── search-service/   # Travel search aggregation
│   └── ...
├── infrastructure/        # Infrastructure as code
│   ├── k8s/              # Kubernetes manifests
│   ├── terraform/        # Terraform configs
│   └── docker/           # Docker configs
├── shared/               # Shared code
│   ├── types/           # TypeScript types
│   └── utils/           # Common utilities
└── docs/                # Documentation
```

## Service Communication

- Use **REST** for synchronous communication
- Use **RabbitMQ** for asynchronous events
- Use **gRPC** for internal service-to-service calls (future)

## Security

- Never commit secrets or API keys
- Use environment variables for configuration
- Validate all user inputs
- Use parameterized queries to prevent SQL injection
- Implement rate limiting on all endpoints
- Use HTTPS everywhere

## Performance

- Implement caching where appropriate
- Use database indexes for frequently queried fields
- Paginate large result sets
- Use async/await for I/O operations
- Monitor query performance

## Questions?

Feel free to:
- Open an issue for questions
- Join our Discord community
- Email us at dev@booksygo.com

## Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes
- Annual contribution reports

Thank you for contributing to BooksyGo! 🚀

