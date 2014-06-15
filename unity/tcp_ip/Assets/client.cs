using UnityEngine;
using System.Collections;
using System.Threading;
using System.Net.Sockets;
using System.Net;
using System.Text.RegularExpressions;
using System.Text;
public class client : MonoBehaviour {

	public string IPAddress;
	public int    port;

	private TcpClient 		tcpip = null;
	private NetworkStream 	net   = null;

	private  		byte[] 			data 			= new byte[10000];
	public  		string 			stream = "";

	//マルチスレッド用
	private Thread read_thread;

	// Use this for initialization
	void Start () {
		tcpip = new TcpClient(IPAddress,port);
		net = tcpip.GetStream ();
		read_thread = new Thread (new ThreadStart (read_stream));
		read_thread.Start ();
	}
	
	// Update is called once per frame
	void Update () {
		if(Input.GetMouseButtonDown(1)){
			byte[] send_byte = Encoding.UTF8.GetBytes("Hello,world");
			net.Write(send_byte,0,send_byte.Length);
			Debug.Log("send");
		}
	}

	private void read_stream(){//**マルチスレッド関数**
		while(true){
			//マルチスレッドの速度？
			Thread.Sleep(0);
			//ストリームの受信
			net.Read(data, 0, data.Length);
			stream = System.Text.Encoding.Default.GetString(data);
			Debug.Log(stream);
		}
	}

	void OnApplicationQuit() {
		net.Close();
	}
}
