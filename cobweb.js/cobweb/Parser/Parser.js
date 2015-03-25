
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
			false: /^false/y,
			true:  /^true/y,

			// Terminal symbols
			OpenBrace:    /^\{/y,
			CloseBrace:   /^\}/y,
			OpenBracket:  /^\[/y,
			CloseBracket: /^\]/y,
			Period:       /^\./y,
			Colon:        /^\:/y,

			// Values
			int32:  /^((?:0[xX][\da-fA-F]+)|(?:[+-]?\d+))/y,
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

		Object .preventExtensions (Grammar);
		Object .freeze (Grammar);
		Object .seal (Grammar);

		/*
		 *  Parser
		 */

		function Parser (scene, input, xml)
		{
			this .scene = scene;
			this .xml   = xml;
			this .setInput (input);
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
					if (!this .xml)
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

					if (!this .xml)
						this .lines (this .value);

					return true;
				}

				return false;
			},
			sfboolValue: function (field)
			{
				if (this .xml)
				{
					if (Grammar .true .parse (this))
					{
						field .set (true);
						return true;
					}

					if (Grammar .false .parse (this))
					{
						field .set (false);
						return true;
					}
				}
				else
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
				}

				return false;
			},
			mfboolValue: function (field)
			{
				return false;
			},
			mfboolValues: function (field)
			{
				field .length = 0;

				var array = field .getValue ();
				var value = new SFBool ();

				while (this .sfboolValue (value))
				{
					value .addParent (field);
					array .push (value);
					value = new SFBool ();
				}
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
				field .length = 0;

				var array = field .getValue ();
				var value = new SFColor ();

				while (this .sfcolorValue (value))
				{
					value .addParent (field);
					array .push (value);
					value = new SFColor ();
				}
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
				field .length = 0;

				var array = field .getValue ();
				var value = new SFColorRGBA ();

				while (this .sfcolorrgbaValue (value))
				{
					value .addParent (field);
					array .push (value);
					value = new SFColorRGBA ();
				}
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
				field .length = 0;

				var array = field .getValue ();
				var value = new SFDouble ();

				while (this .sfdoubleValue (value))
				{
					value .addParent (field);
					array .push (value);
					value = new SFDouble ();
				}
			},
			sffloatValue: function (field)
			{
				return this .sfdoubleValue (field);
			},
			mffloatValue: function (field)
			{
				return false;
			},
			mffloatValues: function (field)
			{
				field .length = 0;

				var array = field .getValue ();
				var value = new SFFloat ();

				while (this .sffloatValue (value))
				{
					value .addParent (field);
					array .push (value);
					value = new SFFloat ();
				}
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
				field .length = 0;

				var array = field .getValue ();
				var value = new SFImage ();

				while (this .sfimageValue (value))
				{
					value .addParent (field);
					array .push (value);
					value = new SFImage ();
				}
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
				field .length = 0;

				var array = field .getValue ();
				var value = new SFInt32 ();

				while (this .sfint32Value (value))
				{
					value .addParent (field);
					array .push (value);
					value = new SFInt32 ();
				}
			},			
			sfmatrix3dValue: function (field)
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
				field .length = 0;

				var array = field .getValue ();
				var value = new SFMatrix3d ();

				while (this .sfmatrix3dValue (value))
				{
					value .addParent (field);
					array .push (value);
					value = new SFMatrix3d ();
				}
			},
			sfmatrix3fValue: function (field)
			{
				return this .sfmatrix3dValue (field);
			},
			mfmatrix3fValue: function (field)
			{
				return false;
			},
			mfmatrix3fValues: function (field)
			{
				field .length = 0;

				var array = field .getValue ();
				var value = new SFMatrix3f ();

				while (this .sfmatrix3fValue (value))
				{
					value .addParent (field);
					array .push (value);
					value = new SFMatrix3f ();
				}
			},
			sfmatrix4dValue: function (field)
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
				field .length = 0;

				var array = field .getValue ();
				var value = new SFMatrix4d ();

				while (this .sfmatrix4dValue (value))
				{
					value .addParent (field);
					array .push (value);
					value = new SFMatrix4d ();
				}
			},
			sfmatrix4fValue: function (field)
			{
				return this .sfmatrix4dValue (field);
			},
			mfmatrix4fValue: function (field)
			{
				return false;
			},
			mfmatrix4fValues: function (field)
			{
				field .length = 0;

				var array = field .getValue ();
				var value = new SFMatrix4f ();

				while (this .sfmatrix4fValue (value))
				{
					value .addParent (field);
					array .push (value);
					value = new SFMatrix4f ();
				}
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
				field .length = 0;

				var array = field .getValue ();
				var value = new SFRotation ();

				while (this .sfrotationValue (value))
				{
					value .addParent (field);
					array .push (value);
					value = new SFRotation ();
				}
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
				field .length = 0;

				var array = field .getValue ();
				var value = new SFString ();

				while (this .sfstringValue (value))
				{
					value .addParent (field);
					array .push (value);
					value = new SFString ();
				}
			},
			sftimeValue: function (field)
			{
				return this .sfdoubleValue (field);
			},
			mftimeValue: function (field)
			{
				return false;
			},
			mftimeValues: function (field)
			{
				field .length = 0;

				var array = field .getValue ();
				var value = new SFTime ();

				while (this .sftimeValue (value))
				{
					value .addParent (field);
					array .push (value);
					value = new SFTime ();
				}
			},
			sfvec2dValue: function (field)
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
				field .length = 0;

				var array = field .getValue ();
				var value = new SFVec2d ();

				while (this .sfvec2dValue (value))
				{
					value .addParent (field);
					array .push (value);
					value = new SFVec2d ();
				}
			},
			sfvec2fValue: function (field)
			{
				return this .sfvec2dValue (field);
			},
			mfvec2fValue: function (field)
			{
				return false;
			},
			mfvec2fValues: function (field)
			{
				field .length = 0;

				var array = field .getValue ();
				var value = new SFVec2f ();

				while (this .sfvec2fValue (value))
				{
					value .addParent (field);
					array .push (value);
					value = new SFVec2f ();
				}
			},
			sfvec3dValue: function (field)
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
				field .length = 0;

				var array = field .getValue ();
				var value = new SFVec3d ();

				while (this .sfvec3dValue (value))
				{
					value .addParent (field);
					array .push (value);
					value = new SFVec3d ();
				}
			},
			sfvec3fValue: function (field)
			{
				return this .sfvec3dValue (field);
			},
			mfvec3fValue: function (field)
			{
				return false;
			},
			mfvec3fValues: function (field)
			{
				field .length = 0;

				var array = field .getValue ();
				var value = new SFVec3f ();

				while (this .sfvec3fValue (value))
				{
					value .addParent (field);
					array .push (value);
					value = new SFVec3f ();
				}
			},
			sfvec4dValue: function (field)
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
				field .length = 0;

				var array = field .getValue ();
				var value = new SFVec4d ();

				while (this .sfvec4dValue (value))
				{
					value .addParent (field);
					array .push (value);
					value = new SFVec4d ();
				}
			},
			sfvec4fValue: function (field)
			{
				return this .sfvec4dValue (field);
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
				field .length = 0;

				var array = field .getValue ();
				var value = new SFVec4f ();

				while (this .sfvec4Value (value))
				{
					value .addParent (field);
					array .push (value);
					value = new SFVec4f ();
				}
			},
		};

		return Parser;
	}
});
