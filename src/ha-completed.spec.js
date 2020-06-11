import HaCompleted from './ha-completed.js';

window.customElements.define(HaCompleted.elementName, HaCompleted);

describe('ha-completed', () => {
  const firebaseMock = {
    init: () => undefined,
    todos: () => {
      let title;
      const todos = {
        completed: {
          today() {
            title = 'For today';
            return todos;
          },
          week() {
            title = 'For week';
            return todos;
          },
        },
        listen(cb) {
          cb([
            {
              completed: 'today',
              title,
              soft: '',
            },
          ]);
          return () => undefined;
        },
      };
      return todos;
    },
  };

  it('renders today at the start', async () => {
    // @ts-ignore
    const list = new HaCompleted(firebaseMock, { addEventListener: () => true, firebase: true });
    await list.connectedCallback();
    const firstChild = /** @type {HTMLElement} */(list.children[0]);
    expect(firstChild.innerText).toMatch('For today');
  });

  it('listens to navigation', async () => {
    const addEventListener = jasmine.createSpy();
    // @ts-ignore
    const list = new HaCompleted(firebaseMock, { addEventListener });
    await list.connectedCallback();
    expect(addEventListener.calls.first().args[0]).toBe('navigate');
  });

  it('renders completed task on navigation to today', async () => {
    let navigator;
    const addEventListener = (name, cb) => {
      navigator = cb;
    };
    // @ts-ignore
    const list = new HaCompleted(firebaseMock, { addEventListener });
    await list.connectedCallback();
    // @ts-ignore
    navigator(new CustomEvent('navigate', { detail: { title: '', path: '/today' } }));
    expect(list.children.length).toBe(1);
    const firstChild = /** @type {HTMLElement} */(list.children[0]);
    expect(firstChild.innerText).toMatch('For today');
  });

  it('renders nothing on later path', async () => {
    let navigator;
    const addEventListener = (name, cb) => {
      navigator = cb;
    };
    // @ts-ignore
    const list = new HaCompleted(firebaseMock, { addEventListener });
    await list.connectedCallback();
    // @ts-ignore
    navigator(new CustomEvent('navigate', { detail: { title: '', path: '/later' } }));
    expect(list.hasChildNodes()).toBe(false);
  });
});
