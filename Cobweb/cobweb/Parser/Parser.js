
define ([
	"jquery",
	"cobweb/Fields",
],
function ($, Fields)
{
	with (Fields)
	{
		/*
		 *  Grammar
		 */

		// VRML lexical elements
		var Grammar =
		{
			// General
			Whitespaces: /^([\x20\n,\t\r]+)/y,

			// Header

			// Keywords
			FALSE: /^FALSE/y,
			TRUE:  /^TRUE/y,

			// Terminal symbols
			OpenBrace:    /^\{/y,
			CloseBrace:   /^\}/y,
			OpenBracket:  /^\[/y,
			CloseBracket: /^\]/y,
			Period:       /^\./y,
			Colon:        /^\:/y,

			// Values
			hex:    /^(0[xX][\da-fA-F]+)/y,
			int32:  /^([+-]?(?:\d+))/y,
			double: /^([+-]?(?:(?:(?:\d*\.\d+)|(?:\d+(?:\.)?))(?:[eE][+-]?\d+)?))/y,
			string: /^"((?:[^\\"]|\\\\|\\\")*)"/y,
			
			Inf:         /^[+]?inf/y,
			NegativeInf: /^-inf/y,
			NaN:         /^[+-]?nan/y,

			// Misc
			Break: /\n/g,
		};

		function parse (parser)
		{
			this .lastIndex = parser .lastIndex;

			parser .result = this .exec (parser .input);
			
			if (parser .result)
			{
				parser .lastIndex = this .lastIndex;
				return true;
			}

			return false;
		}

		for (var key in Grammar)
			Grammar [key] .parse = parse;

		/*
		 *  Parser
		 */

		function Parser (scene, input)
		{
			this .scene = scene;
			this .setInput (input);

			this .SFBool      = new SFBool ();
			this .SFColor     = new SFColor ();
			this .SFColorRGBA = new SFColorRGBA ();
			this .SFDouble    = new SFDouble ();
			this .SFFloat     = new SFFloat ();
			this .SFImage     = new SFImage ();
			this .SFInt32     = new SFInt32 ();
			this .SFMatrix3d  = new SFMatrix3d ();
			this .SFMatrix3f  = new SFMatrix3f ();
			this .SFMatrix4d  = new SFMatrix4d ();
			this .SFMatrix4f  = new SFMatrix4f ();
			this .SFNode      = new SFNode ();
			this .SFRotation  = new SFRotation ();
			this .SFString    = new SFString ();
			this .SFTime      = new SFTime ();
			this .SFVec2f     = new SFVec2f ();
			this .SFVec3f     = new SFVec3f ();
			this .SFVec4f     = new SFVec4f ();
		}
		
		Parser .prototype =
		{
			setInput: function (value)
			{
				this .input      = value;
				this .lineNumber = 1;
				this .lastIndex  = 0;
			},
			comments: function ()
			{
				while (this .comment ())
					;
			},
			comment: function ()
			{
				return this .whitespaces ();
			},
			whitespaces: function ()
			{
				if (Grammar .Whitespaces .parse (this))
				{
					this .lines (this .result [1]);
					return true;
				}

				return false;	
			},
			lines: function (string)
			{
				this .lineNumber += string .match (Grammar .Break);
			},
			double: function ()
			{
				this .comments ();
				
				if (Grammar .double .parse (this))
				{
					this .value = parseFloat (this .result [1]);
					return true;
				}

				if (Grammar .Inf .parse (this))
				{
					this .value = Number .POSITIVE_INFINITY;
					return true;
				}

				if (Grammar .NegativeInf .parse (this))
				{
					this .value = Number .NEGATIVE_INFINITY;
					return true;
				}

				if (Grammar .NaN .parse (this))
				{
					this .value = Number .NaN;
					return true;
				}

				return false;
			},
			int32: function ()
			{
				this .comments ();
				
				if (Grammar .hex .parse (this))
				{
					this .value = parseInt (this .result [1], 16);
					return true;
				}

				if (Grammar .int32 .parse (this))
				{
					this .value = parseInt (this .result [1]);
					return true;
				}

				return false;
			},
			string: function ()
			{
				this .comments ();

				if (Grammar .string .parse (this))
				{
					this .value = SFString .unescape (this .result [1]);
					this .lines (this .value);
					return true;
				}

				return false;
			},
			sfstringValue: function (field)
			{
				if (this .string ())
				{
					field .set (this .value);
					return true;
				}

				return false;
			},
			mfstringValue: function (field)
			{
				return false;
			},
			mfstringValues: function (field)
			{
				while (this .sfstringValue (this .SFString))
					field .push (this .SFString);
			},
			sfboolValue: function (field)
			{
				if (Grammar .TRUE .parse (this))
				{
					field .set (true);
					return true;
				}

				if (Grammar .FALSE .parse (this))
				{
					field .set (false);
					return true;
				}

				return false;
			},
			mfboolValue: function (field)
			{
				return false;
			},
			mfboolValues: function (field)
			{
				while (this .sfboolValue (this .SFBool))
					field .push (this .SFBool);
			},
			sfcolorValue: function (field)
			{
				if (this .double ())
				{
					var r = this .value;
					
					if (this .double ())
					{
						var g = this .value;
						
						if (this .double ())
						{
							var b = this .value;

							field .getValue () .set (r, g, b);
							return true;
						}
					}
				}

				return false;
			},
			mfcolorValue: function (field)
			{
				return false;
			},
			mfcolorValues: function (field)
			{
				while (this .sfcolorValue (this .SFColor))
					field .push (this .SFColor);
			},
			sfcolorrgbaValue: function (field)
			{
				if (this .double ())
				{
					var r = this .value;
					
					if (this .double ())
					{
						var g = this .value;
						
						if (this .double ())
						{
							var b = this .value;

							if (this .double ())
							{
								var a = this .value;

								field .getValue () .set (r, g, b, a);
								return true;
							}
						}
					}
				}

				return false;
			},
			mfcolorrgbaValue: function (field)
			{
				return false;
			},
			mfcolorrgbaValues: function (field)
			{
				while (this .sfcolorrgbaValue (this .SFColorRGBA))
					field .push (this .SFColorRGBA);
			},
			sfdoubleValue: function (field)
			{
				if (this .double ())
				{
					field .set (this .value);
					return true;
				}

				return false;
			},
			mfdoubleValue: function (field)
			{
				return false;
			},
			mfdoubleValues: function (field)
			{
				while (this .sfdoubleValue (this .SFDouble))
					field .push (this .SFDouble);
			},
			mffloatValue: function (field)
			{
				return false;
			},
			mffloatValues: function (field)
			{
				while (this .sfdoubleValue (this .SFFloat))
					field .push (this .SFFloat);
			},
			sfimageValue: function (field)
			{
				if (this .int32 ())
				{
					var width = this .value;
					
					if (this .int32 ())
					{
						var height = this .value;
						
						if (this .int32 ())
						{
							var comp  = this .value;
							var array = [ ];
							var size  = width * height;
							
							for (var i = 0; i < size; ++ i)
							{
								if (this .int32 ())
								{
									array .push (this .value);
									continue;
								}

								return false;
							}

							field .getValue () .set (width, height, comp, array);
							return true;
						}
					}
				}

				return false;
			},
			mfimageValue: function (field)
			{
				return false;
			},
			mfimageValues: function (field)
			{
				while (this .sfimageValue (this .SFImage))
					field .push (this .SFImage);
			},
			sfint32Value: function (field)
			{
				if (this .int32 ())
				{
					field .set (this .value);
					return true;
				}

				return false;
			},
			mfint32Value: function (field)
			{
				return false;
			},
			mfint32Values: function (field)
			{
				while (this .sfint32Value (this .SFInt32))
					field .push (this .SFDouble);
			},			
			sfmatrix3Value: function (field)
			{
				if (this .double ())
				{
					var m00 = this .value;
					
					if (this .double ())
					{
						var m01 = this .value;
						
						if (this .double ())
						{
							var m02 = this .value;

								if (this .double ())
								{
									var m10 = this .value;
									
									if (this .double ())
									{
										var m11 = this .value;
										
										if (this .double ())
										{
											var m12 = this .value;

											if (this .double ())
											{
												var m20 = this .value;
												
												if (this .double ())
												{
													var m21 = this .value;
													
													if (this .double ())
													{
														var m22 = this .value;

														field .getValue () .set (m00, m01, m02,
														                         m10, m11, m12,
														                         m20, m21, m22);
														return true;
												}
											}
										}
									}
								}
							}
						}
					}
				}								
								
				return false;
			},
			mfmatrix3dValue: function (field)
			{
				return false;
			},
			mfmatrix3dValues: function (field)
			{
				while (this .sfmatrix3Value (this .SFMatrix3d))
					field .push (this .SFMatrix3d);
			},
			mfmatrix3fValue: function (field)
			{
				return false;
			},
			mfmatrix3fValues: function (field)
			{
				while (this .sfmatrix3Value (this .SFMatrix3f))
					field .push (this .SFMatrix3f);
			},
			sfmatrix4Value: function (field)
			{
				if (this .double ())
				{
					var m00 = this .value;
					
					if (this .double ())
					{
						var m01 = this .value;
						
						if (this .double ())
						{
							var m02 = this .value;

							if (this .double ())
							{
								var m03 = this .value;
	
								if (this .double ())
								{
									var m10 = this .value;
									
									if (this .double ())
									{
										var m11 = this .value;
										
										if (this .double ())
										{
											var m12 = this .value;

											if (this .double ())
											{
												var m13 = this .value;

												if (this .double ())
												{
													var m20 = this .value;
													
													if (this .double ())
													{
														var m21 = this .value;
														
														if (this .double ())
														{
															var m22 = this .value;

															if (this .double ())
															{
																var m23 = this .value;

																if (this .double ())
																{
																	var m30 = this .value;
																	
																	if (this .double ())
																	{
																		var m31 = this .value;
																		
																		if (this .double ())
																		{
																			var m32 = this .value;

																			if (this .double ())
																			{
																				var m33 = this .value;

																				field .getValue () .set (m00, m01, m02, m03,
																				                         m10, m11, m12, m13,
																				                         m20, m21, m22, m23,
																				                         m30, m31, m32, m33);
																				return true;
																			}
																		}
																	}
																}
															}
														}
													}
												}
											}
										}
									}
								}
							}
						}
					}
				}								
								
				return false;
			},
			mfmatrix4dValue: function (field)
			{
				return false;
			},
			mfmatrix4dValues: function (field)
			{
				while (this .sfmatrix4Value (this .SFMatrix4d))
					field .push (this .SFMatrix4d);
			},
			mfmatrix4fValue: function (field)
			{
				return false;
			},
			mfmatrix4fValues: function (field)
			{
				while (this .sfmatrix4Value (this .SFMatrix4f))
					field .push (this .SFMatrix4f);
			},
			mftimeValue: function (field)
			{
				return false;
			},
			mftimeValues: function (field)
			{
				while (this .sfdoubleValue (this .SFTime))
					field .push (this .SFTime);
			},
			sfrotationValue: function (field)
			{
				if (this .double ())
				{
					var x = this .value;
					
					if (this .double ())
					{
						var y = this .value;
						
						if (this .double ())
						{
							var z = this .value;

							if (this .double ())
							{
								var angle = this .value;

								field .getValue () .set (x, y, z, angle);
								return true;
							}
						}
					}
				}

				return false;
			},
			mfrotationValue: function (field)
			{
				return false;
			},
			mfrotationValues: function (field)
			{
				while (this .sfrotationValue (this .SFRotation))
					field .push (this .SFRotation);
			},
			sfvec2Value: function (field)
			{
				if (this .double ())
				{
					var x = this .value;
					
					if (this .double ())
					{
						var y = this .value;
						
						field .getValue () .set (x, y);
						return true;
					}
				}

				return false;
			},
			mfvec2dValue: function (field)
			{
				return false;
			},
			mfvec2dValues: function (field)
			{
				while (this .sfvec2Value (this .SFVec2d))
					field .push (this .SFVec2d);
			},
			mfvec2fValue: function (field)
			{
				return false;
			},
			mfvec2fValues: function (field)
			{
			while (this .sfvec2Value (this .SFVec2f))
					field .push (this .SFVec2f);
			},
			sfvec3Value: function (field)
			{
				if (this .double ())
				{
					var x = this .value;
					
					if (this .double ())
					{
						var y = this .value;
						
						if (this .double ())
						{
							var z = this .value;

							field .getValue () .set (x, y, z);
							return true;
						}
					}
				}

				return false;
			},
			mfvec3dValue: function (field)
			{
				return false;
			},
			mfvec3dValues: function (field)
			{
				while (this .sfvec3Value (this .SFVec3d))
					field .push (this .SFVec3d);
			},
			mfvec3fValue: function (field)
			{
				return false;
			},
			mfvec3fValues: function (field)
			{
				while (this .sfvec3Value (this .SFVec3f))
					field .push (this .SFVec3f);
			},
			sfvec4Value: function (field)
			{
				if (this .double ())
				{
					var x = this .value;
					
					if (this .double ())
					{
						var y = this .value;
						
						if (this .double ())
						{
							var z = this .value;

							if (this .double ())
							{
								var w = this .value;

								field .getValue () .set (x, y, z);
								return true;
							}
						}
					}
				}

				return false;
			},
			mfvec4dValue: function (field)
			{
				return false;
			},
			mfvec4dValues: function (field)
			{
				while (this .sfvec4Value (this .SFVec4d))
					field .push (this .SFVec4d);
			},
			mfvec4fValue: function (field)
			{
				field .length = 0;

				if (this .sfvec4fValue (this .SFVec4f))
				{
					field .push (this .SFVec4f);
					return true;
				}			

				if (Grammar .OpenBracket .parse (this))
				{
					this .sfvec4fValues (field);

					this .comments ();

					if (Grammar .CloseBracket .parse (this))
						return true;

					throw Error ("Expected ']'.", this .scene .getWorldURL (), this .lineNumber);
				}

				return false;
			},
			mfvec4fValues: function (field)
			{
				while (this .sfvec4Value (this .SFVec4f))
					field .push (this .SFVec4f);
			},
		};

		return Parser;
	}
});
