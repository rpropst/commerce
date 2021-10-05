import { FC } from 'react'
import Link from 'next/link'
import s from './Navbar.module.css'
import NavbarRoot from './NavbarRoot'
import { Logo, Container } from '@components/ui'
import { Searchbar, UserNav } from '@components/common'
import { getSentryRelease } from '@sentry/node'
import * as Sentry from '@sentry/nextjs'

interface Link {
  href: string
  label: string
}
interface NavbarProps {
  links?: Link[]
}

const Navbar: FC<NavbarProps> = ({ links }) => (
  <NavbarRoot>
    <Container>
      <button
        type="button"
        onClick={() => {
          throw new Error("Sentry Frontend Error");
        }}
      >
        Throw error&nbsp;&nbsp;&nbsp;
      </button>
      <button
        type="button"
        onClick={() => {
          try {
            return 1/0
          }
          catch (exception) {
            Sentry.captureException(exception)
          }
        }}
      >
        Handled error&nbsp;&nbsp;&nbsp;
      </button>
      <button
        type="button"
        onClick={async () => 
          { 
            console.log('Button clicked, starting transaction');
            const transaction = Sentry.startTransaction({ name: 'Frontend - Making API Call' });

            Sentry.getCurrentHub().configureScope(scope => scope.setSpan(transaction));

            console.log('Calling api');
            const response = await fetch('/api/error');
            if(!response.ok) {
              const { status: statusCode, statusText } = response;

              const err = new Error(`API Call to /api/error failed: ${statusCode} ${statusText}`);

              Sentry.withScope((scope) => {
                scope.setTags({
                  statusCode,
                  statusText
                });
              })

              Sentry.captureException(err);
            }
            console.log("Finishing transaction");
            transaction.finish();
          }
        }
      >
        Generate Server Error&nbsp;&nbsp;&nbsp;
      </button>
      <button
        type="button"
        onClick={async () => {
            const transaction = Sentry.startTransaction({ name: 'Getting results from Foo' });

            Sentry.getCurrentHub().configureScope(scope => scope.setSpan(transaction));

            const response = await fetch('/api/foo');
            if(!response.ok) {
              const { status: statusCode, statusText } = response;

              const err = new Error(`API Call to /api/foo failed: ${statusCode} ${statusText}`);

              Sentry.withScope((scope) => {
                scope.setTags({
                  statusCode,
                  statusText
                });
              })

              Sentry.captureException(err);
            }
            transaction.finish();
        }}>
        Get My Cool Foo&nbsp;&nbsp;&nbsp;
      </button>
      <button
        type="button"
        onClick={async () => {
            const transaction = Sentry.startTransaction({ name: 'Getting results from Foo' });

            Sentry.getCurrentHub().configureScope(scope => scope.setSpan(transaction));

            const response = await fetch('/api/newFeature');
            if(!response.ok) {
              const { status: statusCode, statusText } = response;

              const err = new Error(`API Call to /api/newFeature failed: ${statusCode} ${statusText}`);

              Sentry.withScope((scope) => {
                scope.setTags({
                  statusCode,
                  statusText
                });
              })

              Sentry.captureException(err);
            }
            transaction.finish();
        }}>
        Awesome new feature!&nbsp;&nbsp;&nbsp;
      </button>
        <div className={s.nav}>
        <div className="flex items-center flex-1">
          <Link href="/">
            <a className={s.logo} aria-label="Logo">
              <Logo />
            </a>
          </Link>
          <nav className={s.navMenu}>
            <Link href="/search">
              <a className={s.link}>All</a>
            </Link>
            {links?.map((l) => (
              <Link href={l.href} key={l.href}>
                <a className={s.link}>{l.label}</a>
              </Link>
            ))}
          </nav>
        </div>
        {process.env.COMMERCE_SEARCH_ENABLED && (
          <div className="justify-center flex-1 hidden lg:flex">
            <Searchbar />
          </div>
        )}
        <div className="flex items-center justify-end flex-1 space-x-8">
          <UserNav />
        </div>
      </div>
      <div className="flex pb-4 lg:px-6 lg:hidden">
        <Searchbar id="mobile-search" />
      </div>
    </Container>
  </NavbarRoot>
)

export default Navbar
