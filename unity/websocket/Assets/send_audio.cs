using UnityEngine;
using System.Collections;
using System;
public class send_audio : MonoBehaviour {

	public AudioClip clip=null;

	public float[] samples;
	public byte[]	data;

	public int i;
	// Use this for initialization
	void Start () {
		samples = new float[clip.samples * clip.channels];
		data	= new byte[clip.samples * clip.channels];
		clip.GetData(samples, 0);
		foreach(int i in samples){
			data = BitConverter.GetBytes(samples[i]);
		}

	}
	
	// Update is called once per frame
	void Update () {
		Debug.Log (data[i]);
	}
}
