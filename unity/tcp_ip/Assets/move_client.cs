using UnityEngine;
using System.Collections;
using System.Threading;
using System.Net.Sockets;
using System.Net;
using System.Text.RegularExpressions;
using System.Text;
using System.Collections.Generic;
using MiniJSON;
public class move_client : MonoBehaviour {
	
	public string IPAddress;
	public int    port;
	
	private TcpClient 		tcpip = null;
	private NetworkStream 	net   = null;
	
	private  		byte[] 			data 			= new byte[10000];
	public  		string 			stream = "";
	
	//マルチスレッド用
	private Thread read_thread;


	private Vector3 tmp;
	// Use this for initialization
	void Start () {
		tcpip = new TcpClient(IPAddress,port);
		net = tcpip.GetStream ();
		read_thread = new Thread (new ThreadStart (read_stream));
		read_thread.Start ();
		tmp = transform.position;
	}
	
	// Update is called once per frame
	

	void Update () {
		Debug.Log(tmp);
		transform.position = tmp;
	}

	public float x,y,z = 0;
	private void read_stream(){//**マルチスレッド関数**
		while(true){
			//マルチスレッドの速度？
			Thread.Sleep(0);
			//ストリームの受信
			net.Read(data, 0, data.Length);
			stream = System.Text.Encoding.Default.GetString(data);

			IList familyList = (IList)Json.Deserialize(stream);
			// リストの内容はオブジェクトなので、辞書型の変数に一つ一つ代入しながら、処理
			foreach(IDictionary person in familyList){
				x = (float)(long)person["x"];
				y = (float)(long)person["y"];
				z = (float)(long)person["z"];
				tmp = new Vector3(x,y,z);
			}
		}
	}
	
	void OnApplicationQuit() {
		read_thread.Abort(); 
		net.Close();
	}
}
