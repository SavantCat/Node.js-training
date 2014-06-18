using UnityEngine;
using System.Collections;
using System.Threading;
using System.Net.Sockets;
using System.Net;
using System.Text.RegularExpressions;
using System.Text;

using MiniJSON;
using System.Collections.Generic;

public class client : MonoBehaviour {

	public string IPAddress;
	public int    port;

	private TcpClient 		tcpip = null;
	private NetworkStream 	net   = null;

	private  		byte[] 			data 			= new byte[10000];
	public  		string 			stream = "";

	//マルチスレッド用
	private Thread read_thread;

	public float x,y,z = 0;
	private Vector3 pos;
	private Vector3 tmp;

	public bool send = true;
	// Use this for initialization
	void Start () {
		tcpip = new TcpClient(IPAddress,port);
		net = tcpip.GetStream ();
		read_thread = new Thread (new ThreadStart (read_stream));
		read_thread.Start ();
		tmp = transform.position;
		byte[] send_byte = Encoding.UTF8.GetBytes("client:"+gameObject.name+"");
		net.Write (send_byte, 0, send_byte.Length);
	}
	
	// Update is called once per frame
	private string json;
	void Update () {
			if (transform.position != tmp && send) {
					string json = 
								"["+
									"{"+
										"\"Type\":\""+"send"+"\","+
										"\"name\":\""+gameObject.name+"\","+
										"\"x\":"+transform.position.x+","+
										"\"y\":"+transform.position.y+","+
										"\"z\":"+transform.position.z+","+
									"},"+
								"]";
					byte[] send_byte = Encoding.UTF8.GetBytes(json+"");
					net.Write (send_byte, 0, send_byte.Length);
					//Debug.Log("send" + gameObject.name);
					tmp = transform.position;
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
			IList familyList = (IList)Json.Deserialize(stream);
			// リストの内容はオブジェクトなので、辞書型の変数に一つ一つ代入しながら、処理

			//pos = new Vector3(x,y,z);
		}
	}

	void OnApplicationQuit() {
		read_thread.Abort(); 
		net.Close();
	}
}
