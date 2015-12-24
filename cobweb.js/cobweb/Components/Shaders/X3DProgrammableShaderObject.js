
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
		matrix3d: new Float32Array (9),
		matrix3f: new Float32Array (9),
		matrix4d: new Float32Array (16),
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
			{
				this .setFields ();
			}
			else
			{
			var
					gl                = this .getBrowser () .getContext (),
					program           = this .getProgram (),
					userDefinedFields = this .getUserDefinedFields ();

				for (var name in userDefinedFields)
				{
					var field = userDefinedFields [name];
	
					switch (field .getType ())
					{
					}
				}
			}
		},
		hasUserDefinedFields: function ()
		{
			return true;
		},
		setFields: function ()
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
					gl .uniform3f (field .uniformLocation_, value .r, value .g, value .b, value .a);
					return;
				}
				case X3DConstants .SFDouble:
				{
					gl .uniform1f (field .uniformLocation_, field .getValue ());
					return;
				}
				case X3DConstants .SFFloat:
				{
					gl .uniform1f (field .uniformLocation_, field .getValue ());
					return;
				}
				case X3DConstants .SFInt32:
				{
					gl .uniform1i (field .uniformLocation_, field .getValue ());
					return;
				}
				case X3DConstants .SFImage:
				{
					return;
				}
				case X3DConstants .SFMatrix3d:
				{
					this .matrix3d .set (field .getValue ());
					gl .uniformMatrix3fv (field .uniformLocation_, false, this .matrix3d);
					return;
				}
				case X3DConstants .SFMatrix3f:
				{
					this .matrix3f .set (field .getValue ());
					gl .uniformMatrix3fv (field .uniformLocation_, false, this .matrix3f);
					return;
				}
				case X3DConstants .SFMatrix4d:
				{
					this .matrix4d .set (field .getValue ());
					gl .uniformMatrix4fv (field .uniformLocation_, false, this .matrix4d);
					return;
				}
				case X3DConstants .SFMatrix4f:
				{
					this .matrix4f .set (field .getValue ());
					gl .uniformMatrix4fv (field .uniformLocation_, false, this .matrix4f);
					return;
				}
				case X3DConstants .SFNode:
				{
					var location = field .uniformLocation_;

					if (location)
					{
						var textureUnit = gl .getUniform (program, location);
			
						if (! textureUnit)
						{
							if (this .getBrowser () .getCombinedTextureUnits () .length)
							{
								textureUnit = this .getBrowser () .getCombinedTextureUnits () .pop ();
								gl .uniform1i (location, textureUnit);
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
							gl .bindTexture (gl .TEXTURE_2D, 0);

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
				case X3DConstants .SFTime:
				{
					gl .uniform1f (field .uniformLocation_, field .getValue ());
					return;
				}
				case X3DConstants .SFVec2d:
				{
					var value = field .getValue ();
					gl .uniform2f (field .uniformLocation_, value .x, value .y);
					return;
				}
				case X3DConstants .SFVec2f:
				{
					var value = field .getValue ();
					gl .uniform2f (field .uniformLocation_, value .x, value .y);
					return;
				}
				case X3DConstants .SFVec3d:
				{
					var value = field .getValue ();
					gl .uniform3f (field .uniformLocation_, value .x, value .y, value .z);
					return;
				}
				case X3DConstants .SFVec3f:
				{
					var value = field .getValue ();
					gl .uniform3f (field .uniformLocation_, value .x, value .y, value .z);
					return;
				}
				case X3DConstants .SFVec4d:
				{
					var value = field .getValue ();
					gl .uniform4f (field .uniformLocation_, value .x, value .y, value .z, value .w);
					return;
				}
				case X3DConstants .SFVec4f:
				{
					var value = field .getValue ();
					gl .uniform4f (field .uniformLocation_, value .x, value .y, value .z, value .w);
					return;
				}
				case X3DConstants .MFFloat:
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
			}
		},
	};

	return X3DProgrammableShaderObject;
});


