using System;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.Collections.Concurrent;
using System.Linq;

public class ParallelRunner<T>
{

	// Accepts a function that returns a task.
	// The function represents an asynchronous task that did not start running yet - and will start running when the function is called.
	// The function should be queued for running, and will run during getResults().
	public void Add(Func<Task<T>> func)
	{
		// TODO: implement
	}


	// Runs the pending tasks concurrently, while never running more than maxConcurrent functions at a time.
	// The function should do its best to run *exactly* maxConcurrent functions at a time - not less - at any given time.
	// The results must be returned in the exact order in which the functions were originally queued using add().
	// If one or more of the queued functions throw an exception, getResults() should throw an exception as well, 
	// and await all the other ongoing function calls, to make sure all of them complete before the function returns, and not call any new functions.
	public async Task<T[]> GetResults(int maxConcurrency)
	{
		// TODO: implement
		return new T[0];
	}
}

public class Program
{
	public static async Task<int> ComplexLogic(int num) {
		Console.WriteLine($"{DateTime.Now.ToString("HH:mm:ss")} start {num}");
		await Task.Delay(TimeSpan.FromSeconds(1));
		//Console.WriteLine($"{DateTime.Now.ToString("HH:mm:ss")} end {num}");
		return num;
	}
	
	public async static Task Logic()
	{
		var jobs = new ParallelRunner<int>();

		for(var i = 0; i < 50; i++)
		{
			var curIndex = i;
			jobs.Add(async () => await Program.ComplexLogic(curIndex));
		}
		
		var results = await jobs.GetResults(10);
		foreach(var num in results)
		{
			Console.WriteLine(num);
		}
		
		Console.WriteLine("done");
	}
	
	public static void Main()
	{
		Task.WaitAll(Program.Logic());
	}

}
