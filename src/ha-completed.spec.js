import HaCompleted from './ha-completed.js';

describe('ha-list', () => {
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

  beforeAll(() => {
    const tmpl = document.createElement('template');
    tmpl.id = 'ha-todo';
    tmpl.innerHTML = `<ha-todo>
      <button></button>
      <ha-title></ha-title>
      <ha-date></ha-date>
    </ha-todo>`;
    document.body.appendChild(tmpl);
  });

  it('renders today at the start', async () => {
    // @ts-ignore
    const list = new HaCompleted(firebaseMock, { addEventListener: () => true, firebase: true });
    await list.connectedCallback();
    expect(list.children[0].innerText).toMatch('For today');
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
    expect(list.children[0].innerText).toMatch('For today');
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
