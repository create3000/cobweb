
define ([
	"jquery",
	"cobweb/Bits/X3DCast",
	"cobweb/Bits/X3DConstants",
],
function ($,
          X3DCast,
          X3DConstants)
{
"use strict";

	function X3DProgrammableShaderObject (browser, executionContext)
	{
		this .addType (X3DConstants .X3DProgrammableShaderObject);
	}

	X3DProgrammableShaderObject .prototype =
	{
		constructor: X3DProgrammableShaderObject,
		matrix3f: new Float32Array (9),
		matrix4f: new Float32Array (16),
		array: [ ],
		initialize: function ()
		{
			this .getExecutionContext () .isLive () .addInterest (this, "set_live__");
			this .isLive () .addInterest (this, "set_live__");

			//Must not call set_live__.
		},
		set_live__: function ()
		{
			if (this .getExecutionContext () .isLive () .getValue () && this .isLive () .getValue ())
				this .addShaderFields ();
			else
				this .removeShaderFields ();
		},
		hasUserDefinedFields: function ()
		{
			return true;
		},
		addShaderFields: function ()
		{
			if (this .isValid_ .getValue ())
			{
				var
					gl                = this .getBrowser () .getContext (),
					program           = this .getProgram (),
					userDefinedFields = this .getUserDefinedFields ();
	
				this .use ();
	
				for (var name in userDefinedFields)
				{
					var field = userDefinedFields [name];
	
					field .uniformLocation_ = gl .getUniformLocation (program, name);
	
					field .addInterest (this, "set_field__");
			
					this .set_field__ (field);
				}
			}
		},
		removeShaderFields: function ()
		{
			if (this .isValid_ .getValue ())
			{
				var
					gl                = this .getBrowser () .getContext (),
					program           = this .getProgram (),
					userDefinedFields = this .getUserDefinedFields ();

				this .use ();

				for (var name in userDefinedFields)
				{
					var field = userDefinedFields [name];
	
					switch (field .getType ())
					{
						case X3DConstants .SFNode:
						{
							var uniformLocation = field .uniformLocation_;
		
							if (uniformLocation)
							{
								var textureUnit = gl .getUniform (program, uniformLocation);
					
								if (textureUnit)
									this .getBrowser () .getCombinedTextureUnits () .push (textureUnit);
	
								gl .uniform1i (uniformLocation, 0);
								gl .activeTexture (gl .TEXTURE0 + textureUnit);
								gl .bindTexture (gl .TEXTURE_2D, null);
								gl .activeTexture (gl .TEXTURE0);
							}
		
							break;
						}
						default:
							continue;
					}
	
					break;
				}
			}
		},
		set_field__: function (field)
		{
			var
				gl       = this .getBrowser () .getContext (),
				program  = this .getProgram ();

			this .use ();

			switch (field .getType ())
			{
				case X3DConstants .SFBool:
				case X3DConstants .SFInt32:
				{
					gl .uniform1i (field .uniformLocation_, field .getValue ());
					return;
				}
				case X3DConstants .SFColor:
				{
					var value = field .getValue ();
					gl .uniform3f (field .uniformLocation_, value .r, value .g, value .b);
					return;
				}
				case X3DConstants .SFColorRGBA:
				{
					var value = field .getValue ();
					gl .uniform4f (field .uniformLocation_, value .r, value .g, value .b, value .a);
					return;
				}
				case X3DConstants .SFDouble:
				case X3DConstants .SFFloat:
				case X3DConstants .SFTime:
				{
					gl .uniform1f (field .uniformLocation_, field .getValue ());
					return;
				}
				case X3DConstants .SFImage:
				{
					return;
				}
				case X3DConstants .SFMatrix3d:
				case X3DConstants .SFMatrix3f:
				{
					this .matrix3f .set (field .getValue ());
					gl .uniformMatrix3fv (field .uniformLocation_, false, this .matrix3f);
					return;
				}
				case X3DConstants .SFMatrix4d:
				case X3DConstants .SFMatrix4f:
				{
					this .matrix4f .set (field .getValue ());
					gl .uniformMatrix4fv (field .uniformLocation_, false, this .matrix4f);
					return;
				}
				case X3DConstants .SFNode:
				{
					var uniformLocation = field .uniformLocation_;

					if (uniformLocation)
					{
						var textureUnit = gl .getUniform (program, uniformLocation);
			
						if (! textureUnit)
						{
							if (this .getBrowser () .getCombinedTextureUnits () .length)
							{
								textureUnit = this .getBrowser () .getCombinedTextureUnits () .pop ();
								gl .uniform1i (uniformLocation, textureUnit);
							}
							else
							{
								this .getBrowser () .println ("Warning: Not enough combined texture units for uniform variable '", field .getName (), "' available.");
								return;
							}
						}

						gl .activeTexture (gl .TEXTURE0 + textureUnit);
			
						var texture = X3DCast (X3DConstants .X3DTextureNode, field);

						if (texture)
							gl .bindTexture (texture .getTarget (), texture .getTexture ());
						else
							gl .bindTexture (gl .TEXTURE_2D, null);

						gl .activeTexture (gl .TEXTURE0);
					}

					return;
				}
				case X3DConstants .SFRotation:
				{
					var quat = field .getValue () .quat;
					gl .uniform4f (field .uniformLocation_, quat .x, quat .y, quat .z, quat .w);
					return;
				}
				case X3DConstants .SFString:
				{
					return;
				}
				case X3DConstants .SFVec2d:
				case X3DConstants .SFVec2f:
				{
					var value = field .getValue ();
					gl .uniform2f (field .uniformLocation_, value .x, value .y);
					return;
				}
				case X3DConstants .SFVec3d:
				case X3DConstants .SFVec3f:
				{
					var value = field .getValue ();
					gl .uniform3f (field .uniformLocation_, value .x, value .y, value .z);
					return;
				}
				case X3DConstants .SFVec4d:
				case X3DConstants .SFVec4f:
				{
					var value = field .getValue ();
					gl .uniform4f (field .uniformLocation_, value .x, value .y, value .z, value .w);
					return;
				}
				case X3DConstants .MFBool:
				case X3DConstants .MFInt32:
				{
					var
						value = field .getValue (),
						array = this .array;

					for (var i = 0, length = value .length; i < length; ++ i)
						array [i] = value [i] .getValue ();

					array .length = length;						

					gl .uniform1iv (field .uniformLocation_, new Int32Array (array));
					return;
				}
				case X3DConstants .MFColor:
				{
					var
						name  = field .getName (),
						value = field .getValue ();

					for (var i = 0, length = value .length; i < length; ++ i)
					{
						var
							color    = value [i] .getValue (),
							location = gl .getUniformLocation (program, name + "[" + i + "]");

						gl .uniform3f (location, color .r, color .g, color .b);
					}

					return;
				}
				case X3DConstants .MFColorRGBA:
				{
					var
						name  = field .getName (),
						value = field .getValue ();

					for (var i = 0, length = value .length; i < length; ++ i)
					{
						var
							color    = value [i] .getValue (),
							location = gl .getUniformLocation (program, name + "[" + i + "]");

						gl .uniform4f (location, color .r, color .g, color .b, color .a);
					}

					return;
				}
				case X3DConstants .MFFloat:
				case X3DConstants .MFDouble:
				case X3DConstants .MFTime:
				{
					var
						value = field .getValue (),
						array = this .array;

					for (var i = 0, length = value .length; i < length; ++ i)
						array [i] = value [i] .getValue ();

					array .length = length;						

					gl .uniform1fv (field .uniformLocation_, new Float32Array (array));
					return;
				}
				case X3DConstants .MFImage:
				{
					return;
				}
				case X3DConstants .MFMatrix3d:
				case X3DConstants .MFMatrix3f:
				{
					var
						name  = field .getName (),
						value = field .getValue ();

					for (var i = 0, length = value .length; i < length; ++ i)
					{
						var location = gl .getUniformLocation (program, name + "[" + i + "]");

						this .matrix3f .set (value [i] .getValue ());
						gl .uniformMatrix3fv (location, false, this .matrix3f);
					}

					return;
				}
				case X3DConstants .MFMatrix4d:
				case X3DConstants .MFMatrix4f:
				{
					var
						name  = field .getName (),
						value = field .getValue ();

					for (var i = 0, length = value .length; i < length; ++ i)
					{
						var location = gl .getUniformLocation (program, name + "[" + i + "]");

						this .matrix4f .set (value [i] .getValue ());
						gl .uniformMatrix4fv (location, false, this .matrix4f);
					}

					return;
				}
				case X3DConstants .MFNode:
				{
					return;
				}
				case X3DConstants .MFRotation:
				{
					var
						name  = field .getName (),
						value = field .getValue ();

					for (var i = 0, length = value .length; i < length; ++ i)
					{
						var
							quat   = value [i] .getValue () .quat,
							location = gl .getUniformLocation (program, name + "[" + i + "]");

						gl .uniform4f (location, quat .x, quat .y, quat .z, quat .w);
					}

					return;
				}
				case X3DConstants .MFString:
				{
					return;
				}
				case X3DConstants .MFVec2d:
				case X3DConstants .MFVec2f:
				{
					var
						name  = field .getName (),
						value = field .getValue ();

					for (var i = 0, length = value .length; i < length; ++ i)
					{
						var
							vector   = value [i] .getValue (),
							location = gl .getUniformLocation (program, name + "[" + i + "]");

						gl .uniform2f (location, vector .x, vector .y);
					}

					return;
				}
				case X3DConstants .MFVec3d:
				case X3DConstants .MFVec3f:
				{
					var
						name  = field .getName (),
						value = field .getValue ();

					for (var i = 0, length = value .length; i < length; ++ i)
					{
						var
							vector   = value [i] .getValue (),
							location = gl .getUniformLocation (program, name + "[" + i + "]");

						gl .uniform3f (location, vector .x, vector .y, vector .z);
					}

					return;
				}
				case X3DConstants .MFVec4d:
				case X3DConstants .MFVec4f:
				{
					var
						name  = field .getName (),
						value = field .getValue ();

					for (var i = 0, length = value .length; i < length; ++ i)
					{
						var
							vector   = value [i] .getValue (),
							location = gl .getUniformLocation (program, name + "[" + i + "]");

						gl .uniform4f (location, vector .x, vector .y, vector .z, vector .w);
					}

					return;
				}
			}
		},
	};

	return X3DProgrammableShaderObject;
});


