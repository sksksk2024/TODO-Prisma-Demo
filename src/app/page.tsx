// page.tsx (Server Component)
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import TodoList, { Todo } from "@/components/TodoList";
import { db } from "@/utils/db";

// to skip the database part, for pushing the traces fast
export const dynamic = "force-dynamic";

const Home = async () => {
  try {
    // Încercăm să tragem datele din Supabase
    const data = (await db.todo.findMany({
      select: {
        id: true,
        input: true,
        createdAt: true,
      },
      orderBy: {
        id: "desc",
      },
    })) as Todo[];

    // Ensure all todos have 'done' explicitly set
    const todosWithDone: Todo[] = data.map((todo) => ({
      ...todo,
      done: todo.done ?? false, // Defaults to false if missing
    }));

    return (
      <>
        <Header />
        <TodoList initialTodos={todosWithDone} />
        <Footer />
      </>
    );
  } catch (error: any) {
    // Dacă pică ceva, afișăm eroarea MARE și CLAR pe ecran
    return (
      <div
        style={{
          padding: "40px",
          backgroundColor: "#fee",
          color: "#900",
          fontFamily: "monospace",
        }}
      >
        <h2>A CRĂPAT SERVERUL. IATĂ EROAREA:</h2>
        <p>
          <strong>Mesaj:</strong> {error.message}
        </p>
        <p>
          <strong>Cod Prisma:</strong> {error.code}
        </p>
        <pre style={{ whiteSpace: "pre-wrap", marginTop: "20px" }}>
          {error.stack}
        </pre>
      </div>
    );
  }
};

export default Home;
